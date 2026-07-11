import React, {
    useEffect,
    useImperativeHandle,
    useState,
    forwardRef,
} from 'react';
import { cn } from '@/lib/utils';
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Table,
    Calculator,
    Sparkles,
    FileText
} from 'lucide-react';

export interface CommandItemProps {
    title: string;
    description: string;
    icon: React.ElementType;
    command: (editor: any) => void;
}

interface CommandListProps {
    items: CommandItemProps[];
    command: (item: CommandItemProps) => void;
    editor: any;
    range: any;
}

export const CommandList = forwardRef((props: CommandListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    return (
        <div className="z-50 min-w-[300px] h-auto max-h-[330px] overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-xl transition-all animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Business Commands
            </div>
            {props.items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <button
                        key={index}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors select-none",
                            index === selectedIndex
                                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                                : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        )}
                        onClick={() => selectItem(index)}
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="font-medium">{item.title}</span>
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
});

CommandList.displayName = 'CommandList';
