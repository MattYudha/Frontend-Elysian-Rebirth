import React from 'react';
import { Button } from '@/components/ui/';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/';
import { Wand2, Languages, FileText, MoreHorizontal, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AiActionBarProps {
    onRewrite?: () => void;
    onTranslate?: () => void;
    onSummarize?: () => void;

    // Simplification: Custom actions array mapping if needed, or just slots.
    // For now, I'll keep the basic structure compatible or simplify.
    moreActions?: { key: string; label: string; icon?: React.ReactNode; onClick?: () => void }[];

    disabled?: boolean;
    className?: string;
}

export const AiActionBar: React.FC<AiActionBarProps> = ({
    onRewrite,
    onTranslate,
    onSummarize,
    moreActions,
    disabled = false,
    className,
}) => {
    // Default actions matching old structure
    const defaultMoreActions = moreActions || [
        {
            key: 'grammar',
            label: 'Fix Grammar',
            icon: <PenTool className="h-4 w-4 mr-2" />,
            onClick: () => console.log('Fix Grammar clicked')
        },
        {
            key: 'expand',
            label: 'Expand Text',
            icon: <PenTool className="h-4 w-4 mr-2" />,
            onClick: () => console.log('Expand Text clicked')
        },
        {
            key: 'simplify',
            label: 'Simplify',
            icon: <PenTool className="h-4 w-4 mr-2" />,
            onClick: () => console.log('Simplify clicked')
        },
    ];

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-1 gap-1",
                className
            )}
        >
            {onRewrite && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRewrite}
                    disabled={disabled}
                    className="rounded-full gap-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                >
                    <Wand2 className="h-4 w-4" />
                    Rewrite
                </Button>
            )}

            {onTranslate && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onTranslate}
                    disabled={disabled}
                    className="rounded-full gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                    <Languages className="h-4 w-4" />
                    Translate
                </Button>
            )}

            {onSummarize && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSummarize}
                    disabled={disabled}
                    className="rounded-full gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                    <FileText className="h-4 w-4" />
                    Summarize
                </Button>
            )}

            {defaultMoreActions && defaultMoreActions.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={disabled}
                            className="rounded-full h-8 w-8 ml-1"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {defaultMoreActions.map((action) => (
                            <DropdownMenuItem key={action.key} onClick={action.onClick}>
                                {action.icon}
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

AiActionBar.displayName = 'AiActionBar';
