import { NextResponse } from 'next/server';

const apiKey = process.env.MINIMAX_API_KEY || process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: "API Key MiniMax belum dikonfigurasi di file .env.local" },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { messages, mode, systemInstruction } = body;

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

        const requestMessages = [];
        requestMessages.push({ role: 'system', content: systemInstructionText });
        
        for (const msg of messages) {
            requestMessages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
            });
        }

        const response = await fetch("https://api.minimax.io/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "MiniMax-M2.5",
                messages: requestMessages,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`MiniMax API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        if (data.base_resp && data.base_resp.status_code !== 0) {
            throw new Error(`MiniMax API error: ${data.base_resp.status_msg} (code ${data.base_resp.status_code})`);
        }

        if (!data.choices || data.choices.length === 0) {
            throw new Error("No response text returned from MiniMax");
        }

        const rawReply = data.choices[0].message.content;
        const responseText = rawReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return NextResponse.json({ reply: responseText });
    } catch (error: any) {
        console.error("MiniMax API Error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat menghubungi layanan AI MiniMax: " + error.message },
            { status: 500 }
        );
    }
}
