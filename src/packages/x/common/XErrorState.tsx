import React from 'react';
import { Button, Result } from 'antd';
import { CloseCircleOutlined, WarningOutlined, DisconnectOutlined } from '@ant-design/icons';

export interface XErrorStateProps {
    /**
     * Error type
     */
    type?: 'error' | 'warning' | 'network';

    /**
     * Error title
     */
    title?: string;

    /**
     * Error message/description
     */
    message?: string;

    /**
     * Retry button callback
     */
    onRetry?: () => void;

    /**
     * Go back button callback
     */
    onGoBack?: () => void;

    /**
     * Custom actions
     */
    actions?: React.ReactNode;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * XErrorState - Standardized error state display
 * 
 * Displays user-friendly error messages with retry options.
 * 
 * @example
 * ```tsx
 * <XErrorState
 *   type="network"
 *   title="Connection Failed"
 *   message="Failed to reach the AI server. Please check your connection."
 *   onRetry={handleRetry}
 * />
 * ```
 */
export const XErrorState: React.FC<XErrorStateProps> = ({
    type = 'error',
    title,
    message,
    onRetry,
    onGoBack,
    actions,
    className,
}) => {
    const getIcon = () => {
        switch (type) {
            case 'network':
                return <DisconnectOutlined />;
            case 'warning':
                return <WarningOutlined />;
            default:
                return <CloseCircleOutlined />;
        }
    };

    const getStatus = (): 'error' | 'warning' | 'info' => {
        return type === 'warning' ? 'warning' : 'error';
    };

    const getDefaultTitle = () => {
        switch (type) {
            case 'network':
                return 'Connection Failed';
            case 'warning':
                return 'Warning';
            default:
                return 'Error Occurred';
        }
    };

    return (
        <div className={className}>
            <Result
                status={getStatus()}
                icon={getIcon()}
                title={title || getDefaultTitle()}
                subTitle={message || 'An unexpected error occurred. Please try again.'}
                extra={
                    actions || (
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            {onRetry && (
                                <Button type="primary" onClick={onRetry}>
                                    Retry
                                </Button>
                            )}
                            {onGoBack && (
                                <Button onClick={onGoBack}>
                                    Go Back
                                </Button>
                            )}
                        </div>
                    )
                }
            />
        </div>
    );
};

XErrorState.displayName = 'XErrorState';
