import { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';

// Smart trigger conditions: what phrases/endings should activate AI suggestions
const TRIGGER_ENDINGS = [
    // Indonesian phrase endings that suggest the user wants a continuation
    /\b(dalam|untuk|guna|agar|supaya|sehingga|karena|dengan|bahwa|yang|ini|itu|tersebut|adalah|merupakan|bertujuan|dimaksudkan|diharapkan|sebagai|selaku|berdasarkan|sesuai|mengacu|meliputi|mencakup|terdiri|antara lain|yaitu|yakni)$/i,
    // End of sentence / common pause points
    /[,;]\s*$/,
    // After a colon (listing something)
    /:\s*$/,
    // After typing a key noun (procurement context)
    /\b(laptop|printer|komputer|server|jaringan|infrastruktur|software|hardware|perangkat|sistem|aplikasi|database|internet|bandwidth|router|switch|UPS|scanner|proyektor|kamera|mikrofon|headset|monitor|keyboard|mouse|flashdisk|harddisk|SSD|RAM|CPU|GPU|NAS|storage)\s*$/i,
    // After budget/document keywords
    /\b(anggaran|kebutuhan|pengadaan|rincian|total|biaya|harga|satuan|jumlah|kuantitas|unit|lembar|pcs|buah|set|paket|termin|tahap|implementasi|evaluasi|monitoring|sosialisasi|pelatihan|workshop|bimtek|rakor|rapat)\s*$/i,
    // After common doc structure words
    /\b(pendahuluan|latar belakang|maksud dan tujuan|sasaran|ruang lingkup|dasar hukum|penutup|kesimpulan|rekomendasi|saran|tindak lanjut)\s*$/i,
    // SPBE keywords
    /\b(SPBE|kominfo|diskominfo|digitalisasi|transformasi digital|e-government|pelayanan publik|pemerintahan|aparatur|ASN|pegawai|dinas|badan|instansi|kabupaten|kecamatan|kelurahan|desa)\s*$/i,
];

// Conditions that SHOULD NOT trigger (user is mid-word or just started)
function shouldNotTrigger(text: string): boolean {
    if (!text || text.trim().length < 5) return true;
    
    const lastChar = text[text.length - 1];
    
    // Don't trigger if the text ends with a newline (new paragraph)
    if (lastChar === '\n') return true;

    // Allow trigger if user just typed a space (waiting for next word)
    if (lastChar === ' ') return false;
    
    // Don't trigger if text ends with numbers only (user typing a price)
    if (/\d+$/.test(text.trimEnd())) return true;
    
    // If no space, only trigger if it ends with punctuation
    if (/[,;:\.]$/.test(text)) return false;

    return true; // Wait for space or punctuation
}

// Calculate a debounce delay based on context:
function getDebounceDelay(text: string): number {
    return 1000; // 1 second debounce for better responsiveness
}

export function useGhostwriter(editor: Editor | null, _isMobile: boolean) {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTextRef = useRef<string>('');
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastSuggestionTextRef = useRef<string>('');

    const clearSuggestion = useCallback(() => {
        setSuggestion(null);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!editor) return;

        const handleUpdate = () => {
            // Clear previous timer on every keystroke
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            const currentText = editor.getText();

            // If user is typing (text is changing), hide current suggestion
            if (currentText !== lastTextRef.current) {
                setSuggestion(null);
                lastTextRef.current = currentText;
            }

            // Skip if conditions aren't met
            if (shouldNotTrigger(currentText)) return;

            // Don't re-fetch if the text hasn't changed since last suggestion
            if (currentText === lastSuggestionTextRef.current) return;

            const delay = getDebounceDelay(currentText);

            timeoutRef.current = setTimeout(async () => {
                // Final check before firing API call
                const latestText = editor.getText();
                if (latestText !== currentText) return; // User typed more, skip
                if (shouldNotTrigger(latestText)) return;

                // Cancel any previous in-flight request
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                abortControllerRef.current = new AbortController();

                setIsLoading(true);
                try {
                    const res = await fetch('/api/ghostwriter/complete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: latestText }),
                        signal: abortControllerRef.current.signal,
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.suggestion && editor.getText() === latestText) {
                            // Only show if user hasn't typed more since API call started
                            setSuggestion(data.suggestion);
                            lastSuggestionTextRef.current = latestText;
                        }
                    }
                } catch (error: any) {
                    if (error?.name !== 'AbortError') {
                        console.error('[Ghostwriter] API call failed:', error);
                    }
                } finally {
                    setIsLoading(false);
                }
            }, delay);
        };

        editor.on('update', handleUpdate);

        // Also dismiss suggestion on selection change (user moved cursor)
        const handleSelectionUpdate = () => {
            // If user moves cursor and there's a suggestion, check if they moved away
            const currentText = editor.getText();
            if (currentText !== lastSuggestionTextRef.current) {
                setSuggestion(null);
            }
        };

        editor.on('selectionUpdate', handleSelectionUpdate);

        return () => {
            editor.off('update', handleUpdate);
            editor.off('selectionUpdate', handleSelectionUpdate);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [editor, clearSuggestion]);

    const acceptSuggestion = useCallback(() => {
        if (!editor || !suggestion) return;

        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        const textBefore = $from.parent.textBetween(0, $from.parentOffset);
        const needsSpace =
            textBefore &&
            !textBefore.endsWith(' ') &&
            !suggestion.startsWith(' ') &&
            !suggestion.startsWith('.') &&
            !suggestion.startsWith(',') &&
            !suggestion.startsWith(';');

        const insertText = needsSpace ? ` ${suggestion}` : suggestion;

        editor.chain().focus().insertContent(insertText).run();
        setSuggestion(null);
        lastSuggestionTextRef.current = '';
    }, [editor, suggestion]);

    const discardSuggestion = useCallback(() => {
        setSuggestion(null);
        lastSuggestionTextRef.current = '';
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
    }, []);

    return {
        suggestion,
        isLoading,
        acceptSuggestion,
        discardSuggestion,
    };
}
