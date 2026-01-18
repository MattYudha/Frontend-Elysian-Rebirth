import { Button } from '@/ui/primitives/button';
import { Plus, MessageSquare } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/ActionTooltip';

interface ActionDockProps {
    onUpload?: () => void;
    onChat?: () => void;
    className?: string;
}

export const ActionDock: React.FC<ActionDockProps> = ({
    onUpload,
    onChat,
    className,
}) => {
    return (
        <div
            className={cn(
                'fixed bottom-8 left-1/2 -translate-x-1/2 z-50',
                'flex items-center gap-2 p-2 rounded-2xl',
                'bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-900/10',
                'transition-all duration-300 hover:scale-105',
                className
            )}
        >
            <ActionTooltip label="Chat with Data">
                <Button
                    onClick={onChat}
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                >
                    <MessageSquare className="w-6 h-6" />
                </Button>
            </ActionTooltip>

            <div className="w-px h-8 bg-slate-200 mx-1" />

            <ActionTooltip label="Upload New File">
                <Button
                    onClick={onUpload}
                    className={cn(
                        'h-12 px-6 rounded-xl gap-2 font-medium',
                        'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
                        'hover:shadow-lg hover:shadow-blue-500/25 border-none'
                    )}
                >
                    <Plus className="w-5 h-5" />
                    <span>Upload File</span>
                </Button>
            </ActionTooltip>
        </div>
    );
};
