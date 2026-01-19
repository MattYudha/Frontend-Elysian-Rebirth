import { Button } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ value, onChange, onSend, disabled, placeholder }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    // Auto-resize
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <div className="relative flex items-end gap-2 p-4 bg-secondary/20 border-t border-border">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Type a message..."}
                className="min-h-[50px] max-h-[200px] resize-none pr-12 bg-background/50 focus-visible:ring-1"
                disabled={disabled}
                rows={1}
            />
            <Button
                onClick={onSend}
                disabled={disabled || !value.trim()}
                className="mb-1"
                size="icon"
            >
                {disabled ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <SendHorizontal className="h-5 w-5" />
                )}
            </Button>
        </div>
    );
}
