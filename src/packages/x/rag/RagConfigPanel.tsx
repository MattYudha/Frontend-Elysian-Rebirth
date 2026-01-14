'use client';

import React, { useState } from 'react';
import { Card, Slider, Select, Button, Space, Typography, Divider, Form, InputNumber } from 'antd';
import { SettingOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface RagConfigData {
    chunkSize: number;
    chunkOverlap: number;
    embeddingModel: string;
    retrievalCount: number;
}

export interface RagConfigPanelProps {
    /**
     * Current RAG configuration
     */
    config?: RagConfigData;

    /**
     * Callback when configuration changes
     */
    onChange?: (config: RagConfigData) => void;

    /**
     * Callback when "Apply & Re-index" is clicked
     */
    onApplyReindex?: (config: RagConfigData) => void;

    /**
     * Whether reindexing is in progress
     */
    isReindexing?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * RagConfigPanel - RAG configuration panel for chunking strategy and embedding model
 * 
 * Provides controls for:
 * - Chunk size and overlap
 * - Embedding model selection
 * - Retrieval count
 * - Apply & Re-index action
 * 
 * @example
 * ```tsx
 * <RagConfigPanel
 *   config={ragConfig}
 *   onChange={handleConfigChange}
 *   onApplyReindex={handleReindex}
 * />
 * ```
 */
export const RagConfigPanel: React.FC<RagConfigPanelProps> = ({
    config,
    onChange,
    onApplyReindex,
    isReindexing = false,
    className,
}) => {
    const [localConfig, setLocalConfig] = useState<RagConfigData>(
        config || {
            chunkSize: 512,
            chunkOverlap: 0.15,
            embeddingModel: 'text-embedding-ada-002',
            retrievalCount: 5,
        }
    );

    const handleChange = (updates: Partial<RagConfigData>) => {
        const newConfig = { ...localConfig, ...updates };
        setLocalConfig(newConfig);
        onChange?.(newConfig);
    };

    const handleApply = () => {
        onApplyReindex?.(localConfig);
    };

    return (
        <Card
            className={className}
            title={
                <Space>
                    <SettingOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                    <span>RAG Configuration</span>
                </Space>
            }
            extra={
                <Button
                    type="primary"
                    icon={<ReloadOutlined spin={isReindexing} />}
                    onClick={handleApply}
                    loading={isReindexing}
                >
                    Apply & Re-index
                </Button>
            }
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
        >
            <Form layout="vertical">
                {/* Chunk Size */}
                <Form.Item label="Chunk Size (tokens)">
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Slider
                            min={128}
                            max={2048}
                            step={64}
                            value={localConfig.chunkSize}
                            onChange={(value) => handleChange({ chunkSize: value })}
                            style={{ flex: 1 }}
                            marks={{
                                128: '128',
                                512: '512',
                                1024: '1K',
                                2048: '2K',
                            }}
                        />
                        <InputNumber
                            min={128}
                            max={2048}
                            value={localConfig.chunkSize}
                            onChange={(value) => handleChange({ chunkSize: value || 512 })}
                            style={{ width: 100 }}
                        />
                    </div>
                </Form.Item>

                {/* Chunk Overlap */}
                <Form.Item label="Chunk Overlap">
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Slider
                            min={0}
                            max={0.5}
                            step={0.05}
                            value={localConfig.chunkOverlap}
                            onChange={(value) => handleChange({ chunkOverlap: value })}
                            style={{ flex: 1 }}
                            marks={{
                                0: '0%',
                                0.15: '15%',
                                0.3: '30%',
                                0.5: '50%',
                            }}
                            tooltip={{ formatter: (value) => `${((value || 0) * 100).toFixed(0)}%` }}
                        />
                        <InputNumber
                            min={0}
                            max={0.5}
                            step={0.05}
                            value={localConfig.chunkOverlap}
                            onChange={(value) => handleChange({ chunkOverlap: value || 0.15 })}
                            style={{ width: 100 }}
                            formatter={(value) => `${((value || 0) * 100).toFixed(0)}%`}
                            parser={(value) => Number(value?.replace('%', '')) / 100}
                        />
                    </div>
                </Form.Item>

                <Divider />

                {/* Embedding Model */}
                <Form.Item label="Embedding Model">
                    <Select
                        value={localConfig.embeddingModel}
                        onChange={(value) => handleChange({ embeddingModel: value })}
                        options={[
                            { label: 'OpenAI - text-embedding-ada-002', value: 'text-embedding-ada-002' },
                            { label: 'OpenAI - text-embedding-3-small', value: 'text-embedding-3-small' },
                            { label: 'OpenAI - text-embedding-3-large', value: 'text-embedding-3-large' },
                            { label: 'Cohere - embed-english-v3.0', value: 'embed-english-v3.0' },
                            { label: 'Custom Model', value: 'custom' },
                        ]}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                {/* Retrieval Count */}
                <Form.Item label="Top-K Retrieval Count">
                    <InputNumber
                        min={1}
                        max={20}
                        value={localConfig.retrievalCount}
                        onChange={(value) => handleChange({ retrievalCount: value || 5 })}
                        style={{ width: '100%' }}
                        addonAfter="chunks"
                    />
                </Form.Item>

                {/* Config Summary */}
                <div
                    style={{
                        marginTop: 24,
                        padding: 16,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 8,
                    }}
                >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <strong>Configuration Summary:</strong><br />
                        • Chunks of ~{localConfig.chunkSize} tokens with {(localConfig.chunkOverlap * 100).toFixed(0)}% overlap<br />
                        • Using {localConfig.embeddingModel} for embeddings<br />
                        • Retrieving top {localConfig.retrievalCount} most relevant chunks
                    </Text>
                </div>
            </Form>
        </Card>
    );
};

RagConfigPanel.displayName = 'RagConfigPanel';
