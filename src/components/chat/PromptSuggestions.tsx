import React from 'react';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

export interface PromptSuggestionsProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    className?: string;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
    suggestions,
    onSelect,
    className,
}) => {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className={cn("mb-6", className)}>
            <div className="flex flex-wrap gap-2.5 justify-center">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(suggestion)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 bg-white/50 border border-white/60 rounded-full hover:bg-white/80 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm transition-all duration-300 backdrop-blur-sm"
                    >
                        <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

PromptSuggestions.displayName = 'PromptSuggestions';
