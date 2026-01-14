import React from 'react';
import type { ThoughtStep } from '../types';
import { Steps, Spin, Typography } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface ThoughtChainProps {
    /**
     * Array of thought steps in the reasoning chain
     */
    steps: ThoughtStep[];

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * ThoughtChain - Multi-step reasoning chain display
 * 
 * Visualizes AI reasoning process with multiple steps showing
 * progress, completion, and any errors.
 * 
 * @example
 * ```tsx
 * <ThoughtChain steps={reasoningSteps} />
 * ```
 */
export const ThoughtChain: React.FC<ThoughtChainProps> = ({ steps, className }) => {
    const getStepIcon = (status: ThoughtStep['status']) => {
        switch (status) {
            case 'processing':
                return <Spin indicator={<LoadingOutlined spin />} size="small" />;
            case 'complete':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'error':
                return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'pending':
            default:
                return null;
        }
    };

    const stepsData = steps.map((step) => ({
        title: step.title,
        description: step.content,
        status: step.status === 'complete' ? 'finish' : step.status === 'error' ? 'error' : 'process',
        icon: getStepIcon(step.status),
    }));

    return (
        <div
            className={className}
            style={{
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                marginBottom: 16,
            }}
        >
            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 14 }}>
                🧠 Reasoning Process
            </Text>

            <Steps
                direction="vertical"
                size="small"
                current={steps.findIndex((s) => s.status === 'processing')}
                items={stepsData as any}
            />
        </div>
    );
};

ThoughtChain.displayName = 'ThoughtChain';
