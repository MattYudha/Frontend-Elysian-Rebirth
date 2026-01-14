import React from 'react';
import { Tag, Space } from 'antd';

export interface PromptSuggestionsProps {
    /**
     * Array of suggested prompts
     */
    suggestions: string[];

    /**
     * Callback when a suggestion is selected
     */
    onSelect: (suggestion: string) => void;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * PromptSuggestions - Row of suggested prompts
 * 
 * Displays clickable prompt suggestions to help users
 * get started or continue the conversation.
 * 
 * @example
 * ```tsx
 * <PromptSuggestions
 *   suggestions={['Explain AI', 'Show examples', 'What can you do?']}
 *   onSelect={handlePromptSelect}
 * />
 * ```
 */
export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
    suggestions,
    onSelect,
    className,
}) => {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className={className} style={{ marginBottom: 16 }}>
            <Space size={[8, 8]} wrap>
                {suggestions.map((suggestion, index) => (
                    <Tag
                        key={index}
                        color="blue"
                        style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            fontSize: 13,
                            borderRadius: 16,
                            border: '1px solid #91d5ff',
                            backgroundColor: '#e6f7ff',
                            transition: 'all 0.2s',
                        }}
                        onClick={() => onSelect(suggestion)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#bae7ff';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#e6f7ff';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        💡 {suggestion}
                    </Tag>
                ))}
            </Space>
        </div>
    );
};

PromptSuggestions.displayName = 'PromptSuggestions';
