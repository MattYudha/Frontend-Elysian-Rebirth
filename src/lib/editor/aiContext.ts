import { Editor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/react';

/**
 * Mengekstraksi teks bersih untuk diproses oleh RAG/Embedding.
 * Menghindari noise dari tag HTML atau struktur JSON.
 * 
 * @param editor Instance Tiptap Editor
 * @returns Utterly clean plain text string
 */
export const extractPlainText = (editor: Editor | null): string => {
    if (!editor) return "";

    // API internal Tiptap yang efisien untuk mengambil text content tanpa tag HTML
    return editor.getText();
};

/**
 * Validate if the content is empty or just a single empty paragraph
 */
export const isEmptyContent = (content?: JSONContent): boolean => {
    if (!content) return true;
    if (!content.content || content.content.length === 0) return true;
    if (content.content.length === 1 && !content.content[0].content) return true;
    return false;
};
