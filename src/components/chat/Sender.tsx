'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Attachment } from '../../types/x';
import { Button } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import { Send, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SenderProps {
    onSend: (message: string, attachments?: Attachment[]) => void;
    onAttach?: (files: Attachment[]) => void;
    onVoice?: () => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const Sender: React.FC<SenderProps> = ({
    onSend,
    onAttach,
    onVoice,
    disabled = false,
    placeholder = 'Type your message...',
    className,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [fileList, setFileList] = useState<File[]>([]);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    const handleSend = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue && fileList.length === 0) {
            return;
        }

        const attachments: Attachment[] = fileList.map((file) => ({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
        }));

        onSend(trimmedValue, attachments.length > 0 ? attachments : undefined);
        setInputValue('');
        setFileList([]);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).slice(0, 5);
            setFileList(newFiles);

            if (onAttach && newFiles.length > 0) {
                const attachments: Attachment[] = newFiles.map((file) => ({
                    id: Math.random().toString(36).substring(7),
                    name: file.name,
                    type: file.type || 'application/octet-stream',
                    size: file.size || 0,
                }));
                onAttach(attachments);
            }
        }
    };

    return (
        <div className={cn("w-full relative", className)} id="chat-input-area">
            <div className="flex items-end gap-2 p-2 bg-background border rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
                <Textarea
                    ref={textAreaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 min-h-[44px] max-h-32 resize-none border-0 focus-visible:ring-0 px-2 py-2.5 bg-transparent shadow-none"
                    rows={1}
                />

                <div className="flex gap-1 pb-1">
                    <div className="relative">
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            id="sender-file-upload"
                            onChange={handleFileChange}
                            disabled={disabled}
                        />
                        <label htmlFor="sender-file-upload">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={disabled}
                                asChild
                                className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <span><Paperclip className="h-5 w-5" /></span>
                            </Button>
                        </label>
                    </div>

                    {onVoice && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onVoice}
                            disabled={disabled}
                            className="h-9 w-9 text-muted-foreground hover:text-foreground"
                        >
                            <Mic className="h-5 w-5" />
                        </Button>
                    )}

                    <Button
                        onClick={handleSend}
                        disabled={disabled || (!inputValue.trim() && fileList.length === 0)}
                        size="icon"
                        className="h-9 w-9"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {fileList.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground px-1">
                    {fileList.length} file(s) attached
                </div>
            )}
        </div>
    );
};

Sender.displayName = 'Sender';
