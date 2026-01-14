'use client';

import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface SaaSLoadingOverlayProps {
    /**
     * Whether the overlay is active
     */
    active: boolean;

    /**
     * Loading message
     */
    message?: string;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * SaaSLoadingOverlay - Overlay loading state component
 * 
 * Can be placed over any page to indicate loading.
 * 
 * @example
 * ```tsx
 * <SaaSLoadingOverlay
 *   active={isLoading}
 *   message="Optimizing RAG index..."
 * />
 * ```
 */
export const SaaSLoadingOverlay: React.FC<SaaSLoadingOverlayProps> = ({
    active,
    message = 'Processing...',
    className,
}) => {
    if (!active) {
        return null;
    }

    return (
        <div
            className={className}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100 vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9998,
                animation: 'fadeIn 0.3s ease-in-out',
            }}
        >
            {/* Glassmorphic card */}
            <div
                style={{
                    padding: '32px 48px',
                    borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 24,
                }}
            >
                <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 48, color: '#ffffff' }} spin />}
                />

                <Text style={{ fontSize: 16, color: '#ffffff', textAlign: 'center' }}>
                    {message}
                </Text>
            </div>

            <style>
                {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
            </style>
        </div>
    );
};

SaaSLoadingOverlay.displayName = 'SaaSLoadingOverlay';
