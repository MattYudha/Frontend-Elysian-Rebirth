import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const opencodeKey = process.env.OPENCODE_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
const apiKey = opencodeKey || geminiKey || "";
const isGemini = !opencodeKey && !!geminiKey;

async function getAIResponse(requestMessages: any[], systemInstructionText: string, apiKey: string, isGemini: boolean): Promise<string> {
    if (isGemini) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstructionText,
        });

        const contents = requestMessages
            .filter((m: any) => m.role !== 'system')
            .map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

        const result = await model.generateContent({
            contents: contents
        });

        return result.response.text();
    } else {
        const baseURL = process.env.OPENCODE_BASE_URL || "https://ai-litellm-app.dev.ciptadusa.com/v1";
        const response = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.OPENCODE_MODEL_NAME || "deepseek-chat", // Default Opencode model
                messages: requestMessages,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`AI API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        if (data.base_resp && data.base_resp.status_code !== 0) {
            throw new Error(`AI API error: ${data.base_resp.status_msg} (code ${data.base_resp.status_code})`);
        }

        if (!data.choices || data.choices.length === 0) {
            throw new Error("No response text returned from AI Service");
        }

        return data.choices[0].message.content;
    }
}

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "API Key belum dikonfigurasi di file .env.local" },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { messages, mode, systemInstruction, debate } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
        }

        let systemInstructionText = systemInstruction || "Anda adalah Elysian Assistant, sebuah AI Agent profesional yang dirancang untuk membantu pengguna dengan analisis bisnis, pemrograman, dan penugasan strategis tingkat enterprise. Berikan jawaban komprehensif menggunakan Bahasa Indonesia jika tidak diminta selain itu.";

        if (!systemInstruction) {
            if (mode === 'planning') {
                systemInstructionText = "Anda adalah arsitek sistem dan planner strategis dari Elysian. Buatkan roadmap yang sangat terstruktur, praktis, dan profesional. Pisahkan menggunakan bullet point.";
            } else if (mode === 'workflow') {
                systemInstructionText = "Anda adalah Workflow Automation Specialist dari Elysian Corp. Berikan langkah-langkah otomatisasi yang efektif.";
            }
        }

        // Inject tools configuration for non-debate chat mode
        if (!debate) {
            systemInstructionText += `
\n[TOOLS CONFIGURATION]
Kamu memiliki akses ke data pengadaan riil Indonesia melalui tool 'query_historical_procurements'.
Jika pengguna menanyakan data pengadaan historis, harga pasar wajar, vendor, atau riwayat anggaran barang (seperti printer, AC, komputer, semen, dll), Kamu WAJIB memanggil tool ini dengan membalas format JSON persis seperti berikut:
TOOL_CALL: {"tool": "query_historical_procurements", "q": "<kata_kunci_barang>", "location": "<provinsi/kota_jika_disebutkan>"}
JANGAN katakan apa-apa lagi selain format TOOL_CALL di atas ketika ingin memanggil tool ini.

[PERENCANAAN HARDWARE & VENDOR (AC, PRINTER, IT HARDWARE)]
Ketika pengguna meminta rekomendasi perencanaan pengadaan hardware (seperti pendingin ruangan/AC, printer kantor, laptop, server, atau perangkat IT lainnya):
1. Panggil tool 'query_historical_procurements' menggunakan kata kunci perangkat terkait untuk melihat riwayat pengadaan riil dan harga pasarnya.
2. Dalam jawaban finalmu, sajikan analisis berupa:
   - Rekomendasi spesifikasi & estimasi budget berdasarkan harga rata-rata historis database Nemesis.
   - Rekomendasi nama paket/vendor yang pernah menangani pengadaan serupa di wilayah tersebut (bila tertera di data).
   - Tips efisiensi anggaran untuk pengadaan barang tersebut.
`;
        }

        const requestMessages = [];
        requestMessages.push({ role: 'system', content: systemInstructionText });
        
        for (const msg of messages) {
            requestMessages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
            });
        }

        if (debate) {
            if (isGemini) {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: 'gemini-2.5-flash',
                    systemInstruction: systemInstructionText,
                });

                const contents = requestMessages
                    .filter((m: any) => m.role !== 'system')
                    .map((m: any) => ({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: m.content }]
                    }));

                const resultStream = await model.generateContentStream({
                    contents: contents
                });

                const encoder = new TextEncoder();
                const customStream = new ReadableStream({
                    async start(controller) {
                        for await (const chunk of resultStream.stream) {
                            const chunkText = chunk.text();
                            if (chunkText) {
                                controller.enqueue(
                                    encoder.encode(`data: ${JSON.stringify({ delta: chunkText })}\n\n`)
                                );
                            }
                        }
                        controller.close();
                    }
                });

                return new Response(customStream, {
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    }
                });
            } else {
                const baseURL = process.env.OPENCODE_BASE_URL || "https://ai-litellm-app.dev.ciptadusa.com/v1";
                const response = await fetch(`${baseURL}/chat/completions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: "kr/deepseek-3.2", // Default Opencode model
                        messages: requestMessages,
                        stream: true,
                    }),
                });

                if (!response.ok) {
                    const errText = await response.text();
                    return NextResponse.json({ error: `AI API returned status ${response.status}: ${errText}` }, { status: 500 });
                }

                const reader = response.body?.getReader();
                const encoder = new TextEncoder();
                const decoder = new TextDecoder();

                const customStream = new ReadableStream({
                    async start(controller) {
                        if (!reader) {
                            controller.close();
                            return;
                        }
                        let buffer = "";
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split("\n");
                            buffer = lines.pop() || "";

                            for (const line of lines) {
                                const cleanLine = line.trim();
                                if (!cleanLine) continue;
                                if (cleanLine === "data: [DONE]") continue;

                                if (cleanLine.startsWith("data: ")) {
                                    try {
                                        const jsonStr = cleanLine.slice(6);
                                        const parsed = JSON.parse(jsonStr);
                                        const delta = parsed.choices?.[0]?.delta?.content || "";
                                        if (delta) {
                                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
                                        }
                                    } catch (e) {
                                        // Ignore json parse errors for incomplete chunks
                                    }
                                }
                            }
                        }
                        controller.close();
                    }
                });

                return new Response(customStream, {
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive",
                    }
                });
            }
        }

        // Standard non-streaming request
        const rawReply = await getAIResponse(requestMessages, systemInstructionText, apiKey, isGemini);
        let responseText = rawReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        // Tool execution flow
        if (responseText.includes("TOOL_CALL:")) {
            const match = responseText.match(/TOOL_CALL:\s*(\{.*\})/);
            if (match && match[1]) {
                try {
                    const toolCall = JSON.parse(match[1]);
                    if (toolCall.tool === "query_historical_procurements" && toolCall.q) {
                        const nemesisUrl = `http://localhost:7777/api/v1/nemesis/query?q=${encodeURIComponent(toolCall.q)}&location=${encodeURIComponent(toolCall.location || "")}`;
                        
                        const authHeader = req.headers.get("Authorization") || "";
                        const tenantHeader = req.headers.get("X-Tenant-ID") || "";
                        const cookieHeader = req.headers.get("Cookie") || "";

                        const backendHeaders: Record<string, string> = {};
                        if (authHeader) backendHeaders["Authorization"] = authHeader;
                        if (tenantHeader) backendHeaders["X-Tenant-ID"] = tenantHeader;
                        if (cookieHeader) backendHeaders["Cookie"] = cookieHeader;

                        const nemesisRes = await fetch(nemesisUrl, {
                            headers: backendHeaders
                        });

                        let dbResultText = "Tidak ditemukan data pengadaan serupa di database Nemesis.";
                        if (nemesisRes.ok) {
                            const nemesisData = await nemesisRes.json();
                            if (nemesisData.data && nemesisData.data.length > 0) {
                                dbResultText = `Ditemukan data pengadaan historis berikut di database Nemesis (SIRUP):\n` +
                                    nemesisData.data.map((r: any) => 
                                        `- Paket: ${r.package_name}, Lokasi: ${r.location}, Anggaran: Rp ${r.budget_amount.toLocaleString('id-ID')}`
                                    ).slice(0, 10).join("\n");
                            }
                        }

                        // Feed tool results back
                        requestMessages.push({ role: 'assistant', content: responseText });
                        requestMessages.push({ 
                            role: 'user', 
                            content: `Berikut adalah hasil pencarian dari database Nemesis:\n${dbResultText}\n\nBerikan jawaban final kepada pengguna berdasarkan data di atas.` 
                        });

                        const finalReply = await getAIResponse(requestMessages, systemInstructionText, apiKey, isGemini);
                        responseText = finalReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                    }
                } catch (e) {
                    console.error("Error executing tool call:", e);
                }
            }
        }

        return NextResponse.json({ reply: responseText });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menghubungi layanan AI: " + error.message },
            { status: 500 }
        );
    }
}
