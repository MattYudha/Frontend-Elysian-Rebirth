'use client';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, MessageSquarePlus, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EditorBubbleMenuProps {
    editor: Editor | null;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    const [isRewriting, setIsRewriting] = useState(false);

    if (!editor) {
        return null;
    }

    const handleAskAI = async () => {
        const selection = editor.view.state.selection;
        const text = editor.state.doc.textBetween(selection.from, selection.to, ' ');
        if (!text) {
            toast.error("Tidak ada teks yang dipilih!");
            return;
        }
        
        setIsRewriting(true);
        const toastId = toast.loading("AI sedang memperbaiki teks Anda...");
        
        try {
            const res = await fetch('/api/ghostwriter/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.suggestion) {
                    editor.chain().focus().insertContent(data.suggestion).run();
                    toast.success("Teks berhasil diperbaiki AI!", { id: toastId });
                } else {
                    toast.error("AI gagal memperbaiki teks.", { id: toastId });
                }
            } else {
                toast.error("Terjadi kesalahan pada server AI.", { id: toastId });
            }
        } catch (e) {
            console.error(e);
            toast.error("Gagal menghubungi AI.", { id: toastId });
        } finally {
            setIsRewriting(false);
        }
    };

    return (
        <BubbleMenu
            editor={editor}
            className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={handleAskAI}
                disabled={isRewriting}
                className={cn("h-8 gap-1.5 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20")}
                title="Ask AI"
            >
                {isRewriting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span className="text-xs font-semibold">Ask AI</span>
            </Button>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <Button
                variant="ghost"
                size="sm"
                onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleBold().run();
                }}
                className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-green-600 text-white hover:bg-green-700 hover:text-white")}
                title="Bold"
            >
                <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleItalic().run();
                }}
                className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-green-600 text-white hover:bg-green-700 hover:text-white")}
                title="Italic"
            >
                <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onMouseDown={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleStrike().run();
                }}
                className={cn("h-8 w-8 p-0", editor.isActive('strike') && "bg-green-600 text-white hover:bg-green-700 hover:text-white")}
                title="Strike"
            >
                <Strikethrough className="h-3.5 w-3.5" />
            </Button>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log("Comment triggered")}
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                title="Add Comment"
            >
                <MessageSquarePlus className="h-3.5 w-3.5" />
            </Button>
        </BubbleMenu>
    );
}
