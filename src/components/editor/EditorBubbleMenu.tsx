'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, MessageSquarePlus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorBubbleMenuProps {
    editor: Editor | null;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    if (!editor) {
        return null;
    }

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, animation: 'scale' }}
            className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    // Placeholder for future AI action
                    console.log("Ask AI triggered");
                }}
                className={cn("h-8 gap-1.5 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20")}
                title="Ask AI"
            >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Ask AI</span>
            </Button>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100")}
                title="Bold"
            >
                <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100")}
                title="Italic"
            >
                <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('strike') && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100")}
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
