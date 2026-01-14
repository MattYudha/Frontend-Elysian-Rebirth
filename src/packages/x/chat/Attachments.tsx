import React from 'react';
import type { Attachment } from '../types';
import { List, Typography, Button, Space, Tag } from 'antd';
import { FileOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface AttachmentsProps {
    /**
     * Array of attached files
     */
    files: Attachment[];

    /**
     * Callback when a file is removed
     */
    onRemove?: (fileId: string) => void;

    /**
     * Whether the attachments are readonly
     */
    readonly?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * Attachments - File attachment preview and management
 * 
 * Displays uploaded files with preview, metadata, and
 * optional remove functionality.
 * 
 * @example
 * ```tsx
 * <Attachments
 *   files={attachedFiles}
 *   onRemove={handleRemoveFile}
 * />
 * ```
 */
export const Attachments: React.FC<AttachmentsProps> = ({
    files,
    onRemove,
    readonly = false,
    className,
}) => {
    if (files.length === 0) {
        return null;
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className={className} style={{ marginBottom: 16 }}>
            <List
                size="small"
                rowKey="id"
                dataSource={files}
                renderItem={(file) => (
                    <List.Item
                        style={{
                            padding: '8px 12px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: 8,
                            marginBottom: 8,
                        }}
                        actions={
                            !readonly && onRemove
                                ? [
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => onRemove(file.id)}
                                    />,
                                ]
                                : undefined
                        }
                    >
                        <List.Item.Meta
                            avatar={<FileOutlined style={{ fontSize: 24, color: '#1677ff' }} />}
                            title={
                                <Space size={8}>
                                    <Text strong style={{ fontSize: 13 }}>
                                        {file.name}
                                    </Text>
                                    <Tag color="default" style={{ fontSize: 11 }}>
                                        {file.type}
                                    </Tag>
                                </Space>
                            }
                            description={
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {formatFileSize(file.size)}
                                </Text>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

Attachments.displayName = 'Attachments';
