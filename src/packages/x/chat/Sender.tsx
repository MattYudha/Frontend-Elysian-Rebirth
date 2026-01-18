'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Attachment } from '../types';
import { Input, Button, Space, Upload } from 'antd';
import { SendOutlined, PaperClipOutlined, AudioOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

const { TextArea } = Input;

export interface SenderProps {
    /**
     * Callback when a message is sent
     */
    onSend: (message: string, attachments?: Attachment[]) => void;

    /**
     * Callback when files are attached
     */
    onAttach?: (files: Attachment[]) => void;

    /**
     * Callback when voice input is triggered
     */
    onVoice?: () => void;

    /**
     * Whether the input is disabled
     */
    disabled?: boolean;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * Sender - Advanced message input component
 * 
 * Supports text input, file attachments, and voice input (stub).
 * Features auto-resize textarea and send button.
 * 
 * @example
 * ```tsx
 * <Sender
 *   onSend={handleSendMessage}
 *   onAttach={handleAttachFiles}
 *   placeholder="Type your message..."
 * />
 * ```
 */
export const Sender: React.FC<SenderProps> = ({
    onSend,
    onAttach,
    onVoice,
    disabled = false,
    placeholder = 'Type your message...',
    className,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const textAreaRef = useRef<any>(null);

    useEffect(() => {
        // Auto-focus on mount
        textAreaRef.current?.focus();
    }, []);

    const handleSend = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue && fileList.length === 0) {
            return;
        }

        // Convert upload files to attachments
        const attachments: Attachment[] = fileList.map((file) => ({
            id: file.uid,
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size || 0,
        }));

        onSend(trimmedValue, attachments.length > 0 ? attachments : undefined);

        // Clear input
        setInputValue('');
        setFileList([]);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFileChange = (info: any) => {
        let newFileList = [...info.fileList];

        // Limit to 5 files
        newFileList = newFileList.slice(-5);

        setFileList(newFileList);

        if (onAttach && newFileList.length > 0) {
            const attachments: Attachment[] = newFileList.map((file) => ({
                id: file.uid,
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: file.size || 0,
            }));
            onAttach(attachments);
        }
    };

    return (
        <div className={className} id="chat-input-area">
            <Space.Compact style={{ width: '100%' }}>
                {/* Text Input */}
                <TextArea
                    ref={textAreaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    disabled={disabled}
                    style={{
                        flex: 1,
                        borderRadius: '8px 0 0 8px',
                    }}
                />

                {/* Action Buttons */}
                <Space.Compact>
                    {/* Attachment Button */}
                    <Upload
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => {
                            return false; // Prevent auto upload
                        }}
                        showUploadList={false}
                        multiple
                    >
                        <Button
                            icon={<PaperClipOutlined />}
                            disabled={disabled}
                            style={{ borderRadius: 0 }}
                        />
                    </Upload>

                    {/* Voice Button (if provided) */}
                    {onVoice && (
                        <Button
                            icon={<AudioOutlined />}
                            onClick={onVoice}
                            disabled={disabled}
                            style={{ borderRadius: 0 }}
                        />
                    )}

                    {/* Send Button */}
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        disabled={disabled || (!inputValue.trim() && fileList.length === 0)}
                        style={{ borderRadius: '0 8px 8px 0' }}
                    >
                        Send
                    </Button>
                </Space.Compact>
            </Space.Compact>

            {/* File count indicator */}
            {fileList.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>
                    {fileList.length} file(s) attached
                </div>
            )}
        </div>
    );
};

Sender.displayName = 'Sender';
