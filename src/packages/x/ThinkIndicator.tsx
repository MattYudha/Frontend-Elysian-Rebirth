import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface ThinkIndicatorProps {
    /**
     * Custom message to display
     */
    message?: string;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * ThinkIndicator - Animated "thinking" indicator
 * 
 * Shows a loading spinner with animated text to indicate
 * that the AI is processing a request.
 * 
 * @example
 * ```tsx
 * {isThinking && <ThinkIndicator message="Analyzing your request..." />}
 * ```
 */
export const ThinkIndicator: React.FC<ThinkIndicatorProps> = ({
    message = 'Thinking...',
    className,
}) => {
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                marginBottom: 16,
            }}
        >
            <Spin indicator={<LoadingOutlined spin />} />
            <span
                style={{
                    fontSize: 14,
                    color: 'rgba(0, 0, 0, 0.65)',
                    animation: 'pulse 1.5s infinite',
                }}
            >
                {message}
            </span>

            <style>
                {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
            </style>
        </div>
    );
};

ThinkIndicator.displayName = 'ThinkIndicator';
