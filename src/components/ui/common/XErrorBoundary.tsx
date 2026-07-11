'use client';

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

export interface XErrorBoundaryProps {
    /**
     * Fallback UI to display when error occurs
     */
    fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);

    /**
     * Callback when error is caught
     */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

    /**
     * Children components
     */
    children: ReactNode;

    /**
     * System name for Sentry tagging
     */
    systemName?: string;
}

interface XErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * XErrorBoundary - Error boundary for graceful error handling
 * 
 * Catches React errors in the component tree and displays fallback UI.
 * Essential for production stability.
 */
export class XErrorBoundary extends Component<XErrorBoundaryProps, XErrorBoundaryState> {
    constructor(props: XErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): XErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Send to Sentry
        Sentry.captureException(error, {
            extra: {
                componentStack: errorInfo.componentStack,
                system: this.props.systemName || 'Global'
            }
        });

        // Call optional prop callback
        this.props.onError?.(error, errorInfo);
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (typeof this.props.fallback === 'function') {
                return this.props.fallback(this.state.error, this.resetError);
            }

            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 400,
                        padding: 24,
                        textAlign: 'center',
                    }}
                >
                    <h2 style={{ color: '#ff4d4f', marginBottom: 16 }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
                        {this.state.error.message}
                    </p>
                    <button
                        onClick={this.resetError}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#1677ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
