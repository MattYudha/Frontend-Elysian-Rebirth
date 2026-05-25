import { NextResponse } from 'next/server';

const apiKey = 'sk-cp-SG-5IJCfPIDQRYO0Ep3JJs8iqzxekQgMDSFZcOfxyWEg8ZNPRTIsS7_g-_ibYxzR4HW3SYpChn4CaDBUHYeb_OPfJvp8i8PhvYt9CDsbeHFbptCDNj4Iw8M';
const apiBaseUrl = 'https://api.minimax.io/v1/chat/completions';
const modelName = 'MiniMax-M2.5';

// A high-fidelity, hyper-targeted rule-based local Indonesian fallback engine
// designed specifically for the SPBE Kominfo Purbalingga budget proposal context.
function getLocalSuggestion(text: string): string | null {
    const textLower = text.toLowerCase().trim();
    
    // Rule 1: Maksud dan Tujuan SPBE
    if (textLower.endsWith('administrasi pemerintahan berbasis') || textLower.endsWith('berbasis elektronik') || textLower.endsWith('spbe')) {
        return "untuk mewujudkan tata kelola pemerintahan yang bersih, efektif, dan transparan.";
    }
    
    // Rule 2: Usulan Pengadaan Laptop/Printer
    if (textLower.endsWith('usulan pengadaan') || textLower.endsWith('pengadaan ini bermaksud') || textLower.endsWith('menyediakan sarana')) {
        return "komputasi portabel and peralatan cetak berkualitas tinggi guna menunjang pelayanan publik.";
    }

    // Rule 3: Maksud dan tujuan detail
    if (textLower.endsWith('maksud dan tujuan')) {
        return "adalah untuk meningkatkan produktivitas aparatur sipil negara di lingkungan Pemkab Purbalingga.";
    }

    // Rule 4: PII and security / blockchain
    if (textLower.endsWith('memastikan bahwa') || textLower.endsWith('menjamin keamanan')) {
        return "seluruh data log transaksi audit compliance ter-commit dengan aman pada blockchain.";
    }

    // Rule 5: Budget/Anggaran
    if (textLower.endsWith('rincian kebutuhan anggaran') || textLower.endsWith('rincian kebutuhan') || textLower.endsWith('alokasi anggaran')) {
        return "disusun berdasarkan analisis harga satuan resmi dari Nemesis database daerah.";
    }

    // Rule 6: Region
    if (textLower.endsWith('wilayah purbalingga') || textLower.endsWith('kabupaten purbalingga')) {
        return "guna mempercepat program transformasi digital SPBE di tingkat daerah.";
    }

    // Rule 7: Kominfo department
    if (textLower.endsWith('diskominfo') || textLower.endsWith('komunikasi dan informatika')) {
        return "selaku leading sector penyelenggaraan infrastruktur teknologi informasi daerah.";
    }

    // Rule 8: Laptop IT
    if (textLower.endsWith('laptop it')) {
        return "sebanyak 8 unit guna mendukung operasional pengolahan data lapangan staf teknis.";
    }

    // Rule 9: Printer
    if (textLower.endsWith('printer')) {
        return "tipe laserjet dengan tingkat kecepatan cetak tinggi untuk draf regulasi daerah.";
    }

    // Generic fallbacks based on trigger words to maintain high-quality SPBE contextual flow
    if (textLower.endsWith('sehingga kami') || textLower.endsWith('sehingga')) {
        return "menyarankan untuk segera melanjutkan ke Tahap 1 implementasi sistem.";
    }

    if (textLower.endsWith('dalam rangka') || textLower.endsWith('dalam')) {
        return "meningkatkan efisiensi operasional kerja pada Dinas Komunikasi dan Informatika.";
    }

    if (textLower.endsWith('sejalan dengan') || textLower.endsWith('sejalan')) {
        return "target rencana pembangunan jangka menengah daerah Kabupaten Purbalingga.";
    }

    if (textLower.endsWith('kebutuhan staf') || textLower.endsWith('staf teknis')) {
        return "dalam bidang persandian dan keamanan informasi untuk pengolahan data.";
    }

    return null;
}

// Helper function to deduplicate suggestions and prevent repetition loops
function deduplicateSuggestion(text: string, suggestion: string): string {
    const textLower = text.toLowerCase().trim();
    const sugLower = suggestion.toLowerCase().trim();
    
    // If the text already ends with this suggestion or contains it, return empty to prevent loops
    if (textLower.endsWith(sugLower) || textLower.includes(sugLower)) {
        return '';
    }
    
    const textWords = textLower.split(/\s+/);
    const sugWords = suggestion.split(/\s+/); // keep original case
    const sugWordsLower = sugLower.split(/\s+/);
    
    // Try to find the maximum overlapping sequence of words at the boundary
    let overlapCount = 0;
    const maxCheck = Math.min(textWords.length, sugWords.length);
    for (let i = 1; i <= maxCheck; i++) {
        const textTail = textWords.slice(-i).map(w => w.toLowerCase()).join(' ');
        const sugHead = sugWordsLower.slice(0, i).join(' ');
        if (textTail === sugHead) {
            overlapCount = i;
        }
    }
    
    if (overlapCount > 0) {
        // Slice off the overlapping words from the suggestion
        return sugWords.slice(overlapCount).join(' ');
    }
    
    return suggestion;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
        }

        // Try local rule-based trigger engine first to maintain lightning-fast responsive UX
        // for exact SPBE/Kominfo context phrases.
        const localRaw = getLocalSuggestion(text);
        if (localRaw) {
            const localSuggestion = deduplicateSuggestion(text, localRaw);
            if (localSuggestion) {
                console.log('[Ghostwriter API] Contextual match (Local Rule):', localSuggestion);
                return NextResponse.json({ suggestion: localSuggestion, source: 'local_rule' });
            }
        }

        // If no local rule matches, attempt to call MiniMax for a fully dynamic completion
        if (!apiKey) {
            console.warn('[Ghostwriter API] API Key is not defined. Falling back to default suggestions.');
            const defaultRaw = "untuk segera melanjutkan ke Tahap 1 implementasi dan integrasi SPBE.";
            const defaultSuggestion = deduplicateSuggestion(text, defaultRaw);
            return NextResponse.json({ 
                suggestion: defaultSuggestion || null,
                source: 'default_fallback' 
            });
        }

        console.log('[Ghostwriter API] Calling MiniMax for completion...');
        
        const lastSentence = text.slice(-300); // Send the last 300 characters as immediate context

        const prompt = `You are a professional SPBE (Sistem Pemerintahan Berbasis Elektronik) and Indonesian government budget proposal assistant.
Your task is to write a highly context-sensitive, relevant sentence continuation (completion suggestion) for the user's text.

Here is the context of the document so far:
"""
${text.slice(0, -300)}
"""

And here is the end of the text where the user has paused:
"... ${lastSentence}"

Provide a clean, elegant continuation that starts exactly from the last few words.
Rules:
1. Keep the suggestion extremely short (between 5 to 12 words max).
2. It must continue the sentence naturally.
3. Do NOT repeat the user's words that are already written in the last sentence. Only output the continuation text.
4. Must be formal, professional, and written in formal Indonesian (EYD).
5. Do NOT write quotes, markdown formatting, reasoning tags, or conversational intro/outros. Only return the completion string.
6. Make it highly relevant to SPBE, Dinas Kominfo Purbalingga, laptop/printer budget, or data verification context if mentioned in the document.

Continuation text:`;

        const minRes = await fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.2,
                max_tokens: 300
            })
        });

        if (!minRes.ok) {
            throw new Error(`MiniMax API error: ${minRes.status} ${minRes.statusText}`);
        }

        const result = await minRes.json();
        let suggestion = result.choices?.[0]?.message?.content?.trim() || '';
        
        // Remove thinking block if any
        suggestion = suggestion.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        // Clean suggestions to make sure it looks like a clean continuation (removes quotes, ellipses)
        suggestion = suggestion.replace(/^["'“”‘`\s\.\,\-]+/g, '');
        suggestion = suggestion.replace(/["'“”‘`\s]+$/g, '');
        suggestion = suggestion.trim();

        // Ensure it doesn't repeat the last typed words
        const words = lastSentence.split(/\s+/);
        const lastWord = words[words.length - 1]?.toLowerCase() || '';
        const suggestionFirstWord = suggestion.split(/\s+/)[0]?.toLowerCase() || '';
        if (lastWord && suggestionFirstWord && lastWord === suggestionFirstWord) {
            suggestion = suggestion.replace(/^\w+\s*/i, '');
        }

        // Deduplicate suggestion
        const dedupedSuggestion = deduplicateSuggestion(text, suggestion);

        if (!dedupedSuggestion) {
            const fallbackRaw = "dan mempercepat integrasi sistem pelayanan publik daerah.";
            const finalFallback = deduplicateSuggestion(text, fallbackRaw);
            return NextResponse.json({ 
                suggestion: finalFallback || null,
                source: 'default_fallback' 
            });
        }

        console.log('[Ghostwriter API] Gemini dynamic suggestion:', dedupedSuggestion);
        return NextResponse.json({ suggestion: dedupedSuggestion, source: 'gemini' });

    } catch (error: any) {
        console.error('[Ghostwriter API] Error:', error.message);
        // Return null instead of a looping hardcoded sentence so the editor simply waits.
        // This is standard industry behavior and avoids loop spams.
        return NextResponse.json({
            suggestion: null,
            source: 'error_fallback'
        });
    }
}
