import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { CommandList } from './CommandList';
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Table,
    Calculator,
    Sparkles,
    FileText,
    CheckCircle2,
    Quote
} from 'lucide-react';

const extensionName = 'slashCommand';

export const SlashCommand = Extension.create({
    name: extensionName,

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: any) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export const getSuggestionItems = ({ query }: { query: string }) => {
    return [
        {
            title: 'Heading 1',
            description: 'Big section heading.',
            icon: Heading1,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading.',
            icon: Heading2,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
            },
        },
        {
            title: 'To-do List',
            description: 'Track tasks with a todo list.',
            icon: CheckCircle2,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
        },
        {
            title: 'Bullet List',
            description: 'Create a simple bulleted list.',
            icon: List,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        // Business Logic Commands
        {
            title: 'Insert SPK Table',
            description: 'Standard Production Specs table.',
            icon: Table,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).insertContent(`
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Specification</th>
                  <th>Qty</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Material</td>
                  <td>Art Paper 150gsm</td>
                  <td>1000</td>
                  <td>Standard</td>
                </tr>
                 <tr>
                  <td>Finishing</td>
                  <td>Laminating Doff</td>
                  <td>-</td>
                  <td>Double Side</td>
                </tr>
              </tbody>
            </table>
            <p></p>
          `).run();
            },
        },
        {
            title: 'Check COGS',
            description: 'Analyze pricing against HPP (Mock).',
            icon: Calculator,
            command: ({ editor, range }: any) => {
                // Mock AI/ML check
                editor.chain().focus().deleteRange(range).insertContent(`
                <blockquote>
                    <strong>🤖 COGS Analysis:</strong><br>
                    Margin estimated at <strong>35%</strong>. Safe to proceed. <br>
                    <em>(Based on current paper prices)</em>
                </blockquote>
             `).run();
            },
        },
        {
            title: 'Ask AI',
            description: 'Generate text or summarize.',
            icon: Sparkles,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).insertContent('AI: Generating summary of this document... [Mock]').run();
            },
        },
        {
            title: 'Generate Overview',
            description: 'Insert a standard overview template.',
            icon: FileText,
            command: ({ editor, range }: any) => {
                editor.chain().focus().deleteRange(range).insertContent(`
                <h2>Executive Summary</h2>
                <p>Provide a brief overview of the document goals and scope here.</p>
                <h3>Key Objectives</h3>
                <ul>
                    <li>Objective 1</li>
                    <li>Objective 2</li>
                    <li>Objective 3</li>
                </ul>
                <hr>
                `).run();
            },
        },
    ].filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
            return item.title.toLowerCase().includes(query.toLowerCase());
        }
        return true;
    });
};

export const renderItems = () => {
    let component: any;
    let popup: any;

    return {
        onStart: (props: any) => {
            component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
            });

            if (!props.clientRect) {
                return;
            }

            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
            });
        },

        onUpdate: (props: any) => {
            component.updateProps(props);

            if (!props.clientRect) {
                return;
            }

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },

        onKeyDown: (props: any) => {
            if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
            }

            return component.ref?.onKeyDown(props);
        },

        onExit: () => {
            popup[0].destroy();
            component.destroy();
        },
    };
};
