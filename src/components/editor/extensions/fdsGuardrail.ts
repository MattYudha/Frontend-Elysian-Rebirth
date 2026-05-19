import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';

// Hackathon Demo Pattern: Look for the specific anomaly trigger words
const ANOMALY_REGEX = /25\.000\.000|25 juta/gi;

function findAnomalies(doc: ProsemirrorNode) {
    const decorations: Decoration[] = [];

    doc.descendants((node, pos) => {
        if (!node.isText) return;

        const text = node.text || '';
        let match;

        // Auto-scan for budget anomalies
        while ((match = ANOMALY_REGEX.exec(text)) !== null) {
            decorations.push(
                Decoration.inline(pos + match.index, pos + match.index + match[0].length, {
                    class: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 rounded px-1 border-b-2 border-orange-500 font-semibold cursor-help relative group fds-highlight transition-all duration-300 animate-pulse',
                    title: 'FDS Guardrail Alert: Nilai anggaran melebihi batas wajar regulasi.'
                })
            );
        }
    });

    return DecorationSet.create(doc, decorations);
}

export const FDSGuardrail = Extension.create({
    name: 'fdsGuardrail',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('fdsGuardrail'),
                state: {
                    init(_, { doc }) {
                        return findAnomalies(doc);
                    },
                    apply(transaction, oldState) {
                        return transaction.docChanged ? findAnomalies(transaction.doc) : oldState;
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
