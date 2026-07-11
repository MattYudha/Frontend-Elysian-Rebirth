import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';

interface Violation {
    term: string;
    max_price: number;
}

function findAnomalies(doc: ProsemirrorNode, violations: Violation[]) {
    const decorations: Decoration[] = [];
    if (!violations || violations.length === 0) {
        return DecorationSet.create(doc, []);
    }

    doc.descendants((node, pos) => {
        if (!node.isText) return;

        const text = node.text || '';
        
        for (const v of violations) {
            if (!v.term) continue;
            // Case-insensitive exact substring search
            const escaped = v.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(escaped, 'gi');
            let match;

            while ((match = regex.exec(text)) !== null) {
                decorations.push(
                    Decoration.inline(pos + match.index, pos + match.index + match[0].length, {
                        class: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 rounded px-1 border-b-2 border-red-500 font-semibold cursor-help relative group fds-highlight transition-all duration-300 animate-pulse',
                        title: `FDS Guardrail: Anggaran melebihi batas resmi Rp ${v.max_price.toLocaleString('id-ID')}`
                    })
                );
            }
        }
    });

    return DecorationSet.create(doc, decorations);
}

export const FDSGuardrail = Extension.create<{ violations: Violation[] }>({
    name: 'fdsGuardrail',

    addOptions() {
        return {
            violations: [],
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('fdsGuardrail'),
                state: {
                    init(_, { doc }) {
                        return {
                            decoSet: findAnomalies(doc, []),
                            violations: []
                        };
                    },
                    apply(transaction, oldState) {
                        const metaViolations = transaction.getMeta('fdsGuardrailViolations');
                        const violations = metaViolations !== undefined ? metaViolations : oldState.violations;

                        if (transaction.docChanged || metaViolations !== undefined || transaction.getMeta('fdsGuardrailForceUpdate')) {
                            return {
                                decoSet: findAnomalies(transaction.doc, violations),
                                violations: violations
                            };
                        }
                        return oldState;
                    },
                },
                props: {
                    decorations(state) {
                        const pluginState = this.getState(state);
                        return pluginState ? pluginState.decoSet : undefined;
                    },
                },
            }),
        ];
    },
});
