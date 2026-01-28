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
    Redo
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
        <div className="border-b border-border bg-muted/40 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-sm">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('strike') && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Strike"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 1 }) && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 2 }) && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 3 }) && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('bulletList') && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('orderedList') && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("h-8 w-8 p-0", editor.isActive('blockquote') && "bg-slate-200 dark:bg-slate-700 text-blue-600")}
                title="Quote"
            >
                <Quote className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-0"
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-0"
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    );
}
