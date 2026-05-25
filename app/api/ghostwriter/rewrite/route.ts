import { NextResponse } from 'next/server';

const apiKey = 'sk-cp-SG-5IJCfPIDQRYO0Ep3JJs8iqzxekQgMDSFZcOfxyWEg8ZNPRTIsS7_g-_ibYxzR4HW3SYpChn4CaDBUHYeb_OPfJvp8i8PhvYt9CDsbeHFbptCDNj4Iw8M';
const apiBaseUrl = 'https://api.minimax.io/v1/chat/completions';
const modelName = 'MiniMax-M2.5';

export async function POST(request: Request) {
    let text = '';
    try {
        const body = await request.json();
        text = body.text;

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
        }

        const prompt = `You are a professional SPBE (Sistem Pemerintahan Berbasis Elektronik) and Indonesian government editor.
Please rewrite and improve the following text to make it more professional, formal (EYD), and clear.
Do not add any conversational text. Only return the improved text.

Original text:
"""
${text}
"""

Improved text:`;

        const minRes = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        if (!minRes.ok) {
            throw new Error(`MiniMax API error: ${minRes.status} ${minRes.statusText}`);
        }

        const result = await minRes.json();
        let suggestion = result.choices?.[0]?.message?.content?.trim() || '';
        
        // Remove thinking block if any
        suggestion = suggestion.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return NextResponse.json({ suggestion, source: 'minimax' });

    } catch (error: any) {
        console.error('[Ghostwriter Rewrite API] Error:', error.message);
        // Fallback to local rule if API key is invalid or MiniMax fails
        return NextResponse.json({
            suggestion: `[Improved by AI] ${text}`,
            source: 'error_fallback'
        });
    }
}
