'use client';

import { Button } from '@/components/ui/';
import { Card } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Save, FileText, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorDocument } from '@/lib/sdk/schemas';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { useMemo } from 'react';

interface DocumentEditorProps {
    document: EditorDocument;
    initialContent: JSONContent | null;
    onChange: (content: JSONContent) => void;
    onSave: () => void;
    pdfUrl?: string;
    isMobile?: boolean;
}

export function DocumentEditor({
    document,
    initialContent,
    onChange,
    onSave,
    pdfUrl,
    isMobile = false
}: DocumentEditorProps) {
    // Default schema to prevent crashes
    const defaultContent: JSONContent = {
        type: 'doc',
        content: [{ type: 'paragraph' }]
    };

    const extensions = useMemo(() => [
        StarterKit.configure({
            heading: { levels: [1, 2, 3] },
        }),
        Placeholder.configure({
            placeholder: 'Mulai ketik spesifikasi produksi di sini...',
            emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0',
        }),
        CharacterCount,
    ], []);

    const editor = useEditor({
        extensions,
        content: initialContent || defaultContent,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[500px] max-w-none dark:prose-invert',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    return (
        <div className={cn(
            "flex flex-1 gap-4 p-4 h-full",
            isMobile ? "flex-col" : "flex-row"
        )}>
            {/* PDF/Source View */}
            {!isMobile && pdfUrl && (
                <Card className="flex-1 bg-muted/30 border-border overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-border flex justify-between items-center bg-card/50">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm font-medium">Source Document</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Maximize2 className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="flex-1 bg-muted flex items-center justify-center text-muted-foreground">
                        {/* Placeholder for PDF Viewer */}
                        <div className="text-center p-6">
                            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>PDF Viewer Placeholder</p>
                            <p className="text-xs text-muted-foreground mt-1">{pdfUrl}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Editor View */}
            <Card className="flex-1 border-border flex flex-col bg-card overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal bg-white dark:bg-slate-800">
                            v{document.version}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                            {document.title}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                            {editor?.storage.characterCount.words() || 0} words
                        </span>
                    </div>
                    <Button size="sm" onClick={onSave} className="h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                </div>

                {/* Tiptap Toolbar */}
                <EditorToolbar editor={editor} />

                {/* Floating Menu */}
                <EditorBubbleMenu editor={editor} />

                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950/50 cursor-text" onClick={() => editor?.chain().focus().run()}>
                    <EditorContent editor={editor} />
                </div>
            </Card>
        </div>
    );
}
