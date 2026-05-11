import os
import sys
import json
import time
import requests
import redis
from openai import OpenAI
from dotenv import load_dotenv

# Load env from the same directory as this script
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

REDIS_QUEUE = "swarm:tasks"

# Initialize OpenAI-compatible client
# Supports any OpenAI-compatible endpoint (e.g., OpenAI, Aliyun Qwen, etc.)
client = OpenAI(
    api_key=os.getenv("LLM_API_KEY", "dummy_key"),
    base_url=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
)
MODEL_NAME = os.getenv("LLM_MODEL_NAME", "gpt-4o-mini")

# Load Standar Harga Referensi (POJK) as context for the Auditor agent
_STANDAR_HARGA_PATH = os.path.join(os.path.dirname(__file__), "DUMMY_POJK_Standar_Harga.md")
STANDAR_HARGA_CONTEXT = ""
if os.path.exists(_STANDAR_HARGA_PATH):
    with open(_STANDAR_HARGA_PATH, "r", encoding="utf-8") as f:
        STANDAR_HARGA_CONTEXT = f.read()
    print(f"[Init] Loaded Standar Harga context ({len(STANDAR_HARGA_CONTEXT)} chars)")
else:
    print("[Init] WARNING: DUMMY_POJK_Standar_Harga.md not found. Auditor will use LLM base knowledge only.")


def run_agent(system_prompt: str, user_prompt: str) -> str:
    """Utility to run a single agent completion."""
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,  # Low temperature for analytical tasks
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[LLM Error] {e}")
        return f"Error connecting to LLM: {str(e)}"


def run_swarm_evaluation(item: dict) -> tuple[str, list, str]:
    """
    Executes the multi-agent swarm evaluation for a single budget item.

    Agents:
      1. Auditor   — Compares price against Standar Harga Regional
      2. Compliance — Evaluates legal justification / regulatory exceptions
      3. Manager   — Decides final FLAGGED | CLEARED verdict as JSON

    Returns: (status, agent_logs, manager_conclusion)
    """
    item_json = json.dumps(item, ensure_ascii=False)

    # ------------------------------------------------------------------
    # 1. Agent Analis (Auditor)
    # ------------------------------------------------------------------
    standar_harga_section = (
        f"\n\nBerikut adalah Standar Harga Regional yang menjadi acuanmu:\n{STANDAR_HARGA_CONTEXT}"
        if STANDAR_HARGA_CONTEXT else ""
    )
    auditor_system = f"""
    Kamu adalah Agen Analis (Auditor Anggaran) di Pemerintah Daerah.
    Tugasmu adalah membandingkan item anggaran yang diajukan dengan Standar Harga Regional.
    Jika harga yang diajukan lebih tinggi dari standar harga pasar wajar,
    nyatakan dengan tegas potensi MARKUP beserta selisih angkanya.
    Jika wajar, nyatakan WAJAR.
    Jawab secara analitis dan singkat (maksimal 3 kalimat).{standar_harga_section}
    """

    print(f"  -> [Auditor] Evaluating: {item.get('name')}")
    auditor_response = run_agent(auditor_system, f"Evaluasi item ini:\n{item_json}")

    # ------------------------------------------------------------------
    # 2. Agent Pengawas (Compliance)
    # ------------------------------------------------------------------
    compliance_system = """
    Kamu adalah Agen Pengawas (Compliance/Legal) di Pemerintah Daerah.
    Tugasmu adalah meninjau temuan dari Agen Analis dan mengevaluasi apakah
    ada justifikasi atau pasal regulasi yang mengizinkan pengecualian harga
    (misalnya spesifikasi khusus untuk departemen tertentu).
    Jawab secara legal dan kepatuhan (maksimal 3 kalimat).
    """

    compliance_user = (
        f"Item yang diajukan:\n{item_json}\n\n"
        f"Temuan Auditor:\n{auditor_response}\n\n"
        f"Berikan evaluasi kepatuhanmu:"
    )
    print(f"  -> [Compliance] Reviewing: {item.get('name')}")
    compliance_response = run_agent(compliance_system, compliance_user)

    # ------------------------------------------------------------------
    # 3. Agent Manajer (Decision Maker)
    # ------------------------------------------------------------------
    manager_system = """
    Kamu adalah Agen Manajer (Kepala Review).
    Tugasmu adalah membaca temuan Auditor dan Pengawas, lalu memberikan kesimpulan akhir.
    Kamu HARUS merespon hanya dalam format JSON valid berikut:
    {
        "status": "FLAGGED" | "CLEARED",
        "manager_conclusion": "Kesimpulan singkat maksimal 2 kalimat"
    }
    Gunakan "FLAGGED" jika ada indikasi kuat markup yang tidak memiliki justifikasi legal.
    Gunakan "CLEARED" jika harga wajar atau ada justifikasi legal yang kuat.
    """

    manager_user = (
        f"Item:\n{item_json}\n\n"
        f"Auditor:\n{auditor_response}\n\n"
        f"Pengawas:\n{compliance_response}\n\n"
        f"Berikan kesimpulan JSON:"
    )
    print(f"  -> [Manager] Concluding: {item.get('name')}")
    manager_response_raw = run_agent(manager_system, manager_user)

    # Parse manager JSON — with graceful fallback
    status = "CLEARED"
    manager_conclusion = "Tidak dapat mem-parsing kesimpulan Manajer."
    try:
        clean_json = manager_response_raw.replace("```json", "").replace("```", "").strip()
        manager_data = json.loads(clean_json)
        status = manager_data.get("status", "CLEARED")
        manager_conclusion = manager_data.get("manager_conclusion", manager_response_raw)
    except Exception as e:
        print(f"[JSON Error] Failed to parse manager response: {e}")
        status = "FLAGGED" if "FLAGGED" in manager_response_raw.upper() else "CLEARED"
        manager_conclusion = manager_response_raw

    agent_logs = [
        {"agent": "Auditor", "action": "Price Checking", "message": auditor_response},
        {"agent": "Pengawas", "action": "Compliance Review", "message": compliance_response},
    ]

    return status, agent_logs, manager_conclusion


def process_task(task_data: dict) -> None:
    """Process the swarm task by orchestrating the agents."""
    task_id = task_data.get("task_id")
    webhook_url = task_data.get("webhook_url")
    items = task_data.get("items", [])

    print(f"\n[Worker] Processing task {task_id} with {len(items)} items")

    results = []
    markup_count = 0

    for item in items:
        status, agent_logs, manager_conclusion = run_swarm_evaluation(item)

        if status == "FLAGGED":
            markup_count += 1

        results.append({
            "item_id": item.get("item_id"),
            "status": status,
            "agent_logs": agent_logs,
            "manager_conclusion": manager_conclusion,
        })

    summary = (
        f"Swarm Review Selesai. "
        f"Ditemukan {markup_count} indikasi markup dari total {len(items)} item."
    )

    response_payload = {
        "task_id": task_id,
        "status": "COMPLETED",
        "summary": summary,
        "results": results,
    }

    # Send webhook back to Elysian Go backend
    if webhook_url:
        print(f"[Worker] Sending webhook to {webhook_url}")
        try:
            resp = requests.post(webhook_url, json=response_payload, timeout=10)
            resp.raise_for_status()
            print(f"[Worker] Webhook sent successfully: {resp.status_code}")
        except Exception as e:
            print(f"[Worker] Failed to send webhook: {str(e)}")
    else:
        print("[Worker] No webhook URL provided, skipping callback.")


def main() -> None:
    print(f"[Elysian Swarm Worker] Connecting to Redis at {REDIS_HOST}:{REDIS_PORT} db={REDIS_DB}")

    if os.getenv("LLM_API_KEY") in [None, "dummy_key", ""]:
        print("[WARNING] LLM_API_KEY is not set. API calls will fail unless using a mock endpoint.")

    try:
        r = redis.Redis(
            host=REDIS_HOST,
            port=REDIS_PORT,
            db=REDIS_DB,
            password=REDIS_PASSWORD,
            decode_responses=True,
        )
        r.ping()
        print(f"[Worker] Connected to Redis. Listening on queue: {REDIS_QUEUE}")
    except Exception as e:
        print(f"[Worker] Failed to connect to Redis: {str(e)}")
        sys.exit(1)

    while True:
        try:
            result = r.brpop(REDIS_QUEUE, timeout=0)
            if result:
                _queue_name, task_json = result
                task_data = json.loads(task_json)
                process_task(task_data)
        except json.JSONDecodeError:
            print(f"[Worker] Failed to decode task JSON: {task_json}")
        except Exception as e:
            print(f"[Worker] Error processing task: {str(e)}")
            time.sleep(1)


if __name__ == "__main__":
    main()
