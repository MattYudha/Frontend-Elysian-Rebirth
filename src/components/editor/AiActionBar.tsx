import { Button } from '@/components/ui/';
import {
    Wand2,
    Languages,
    FileText,
    CheckCircle
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/';

interface AiActionBarProps {
    actions: string[];
    onAction: (action: string) => void;
}

export function AiActionBar({ onAction }: AiActionBarProps) {
    return (
        <div className="border-t border-border bg-card p-2 flex justify-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => onAction('rewrite')}>
                            <Wand2 className="mr-2 h-4 w-4 text-purple-400" />
                            Rewrite
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Improve writing style and clarity</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => onAction('summarize')}>
                            <FileText className="mr-2 h-4 w-4 text-blue-400" />
                            Summarize
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate a concise summary</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => onAction('translate')}>
                            <Languages className="mr-2 h-4 w-4 text-green-400" />
                            Translate
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Translate to another language</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => onAction('fix_grammar')}>
                            <CheckCircle className="mr-2 h-4 w-4 text-amber-400" />
                            Fix Grammar
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Correct grammatical errors</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
