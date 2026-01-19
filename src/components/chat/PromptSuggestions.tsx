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
        <div className={cn("mb-4", className)}>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(suggestion)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                        <Lightbulb className="w-3 h-3 text-blue-500" />
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

PromptSuggestions.displayName = 'PromptSuggestions';
