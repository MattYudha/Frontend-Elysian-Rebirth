import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';

const NIK_REGEX = /\b\d{16}\b/g;

function findPii(doc: ProsemirrorNode) {
  const decorations: Decoration[] = [];
  
  doc.descendants((node, pos) => {
    if (!node.isText) return;
    
    const text = node.text || '';
    let match;
    
    // Find NIKs
    while ((match = NIK_REGEX.exec(text)) !== null) {
      decorations.push(
        Decoration.inline(pos + match.index, pos + match.index + match[0].length, {
          class: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded px-1 border border-purple-200 dark:border-purple-800 font-mono cursor-pointer relative group pii-highlight',
          title: 'Protected PII Data (Masked on transmit)'
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

export const PIIHighlighter = Extension.create({
  name: 'piiHighlighter',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('piiHighlighter'),
        state: {
          init(_, { doc }) {
            return findPii(doc);
          },
          apply(transaction, oldState) {
            return transaction.docChanged ? findPii(transaction.doc) : oldState;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
