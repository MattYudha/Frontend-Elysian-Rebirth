'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    FilePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
    editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-slate-200 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#0b1120]/60 p-2 flex overflow-x-auto whitespace-nowrap no-scrollbar gap-1.5 items-center sticky top-0 z-10 backdrop-blur-sm w-full scroll-smooth select-none shrink-0">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('bold') && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('italic') && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('strike') && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Strike"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 dark:bg-blue-950/40 mx-1 shrink-0" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('heading', { level: 1 }) && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('heading', { level: 2 }) && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('heading', { level: 3 }) && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 dark:bg-blue-950/40 mx-1 shrink-0" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('bulletList') && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('orderedList') && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("h-8 w-8 p-0 shrink-0", editor.isActive('blockquote') && "bg-slate-250 dark:bg-slate-800 text-blue-600 dark:text-blue-400")}
                title="Quote"
            >
                <Quote className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-slate-200 dark:bg-blue-950/40 mx-1 shrink-0" />

            {/* ENTERPRISE ADD A4 PAGE BUTTON */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 gap-1.5 px-2.5 shrink-0 bg-blue-500/10 hover:bg-blue-500 text-blue-650 hover:text-white dark:text-blue-450 border border-blue-200/40 dark:border-blue-900/35 rounded-lg text-xs font-bold transition-all shadow-none"
                title="Add Page (Page Break)"
            >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Add Page</span>
            </Button>

            <div className="w-px h-6 bg-slate-200 dark:bg-blue-950/40 mx-1 shrink-0" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => (editor.chain().focus() as any).undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0 shrink-0"
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => (editor.chain().focus() as any).redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0 shrink-0"
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
}
