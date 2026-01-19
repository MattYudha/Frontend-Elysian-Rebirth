'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export type TelemetryEvent =
    | { type: 'message_sent'; payload: { content: string; attachments?: number } }
    | { type: 'ai_response_received'; payload: { content: string; latency: number } }
    | { type: 'rag_query_executed'; payload: { query: string; chunks: number } }
    | { type: 'workflow_step_run'; payload: { workflowId: string; step: string } }
    | { type: 'user_navigation'; payload: { from: string; to: string } }
    | { type: 'error_occurred'; payload: { error: string; context: string } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'custom'; payload: Record<string, any>; name: string };

export type TelemetryHandler = (event: TelemetryEvent) => void;

interface TelemetryContextValue {
    emit: TelemetryHandler;
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

export interface TelemetryProviderProps {
    /**
     * Telemetry event handler
     */
    onEvent: TelemetryHandler;

    /**
     * Children components
     */
    children: ReactNode;
}

/**
 * TelemetryProvider - Global telemetry/analytics provider
 * 
 * Provides event tracking throughout the application.
 * Integrates with Datadog, Segment, Google Analytics, etc.
 * 
 * @example
 * ```tsx
 * <TelemetryProvider
 *   onEvent={(event) => {
 *     // Send to your analytics service
 *     analytics.track(event.type, event.payload);
 *     console.log('[Telemetry]', event);
 *   }}
 * >
 *   <App />
 * </TelemetryProvider>
 * ```
 */
export const TelemetryProvider: React.FC<TelemetryProviderProps> = ({ onEvent, children }) => {
    return (
        <TelemetryContext.Provider value={{ emit: onEvent }}>
            {children}
        </TelemetryContext.Provider>
    );
};

/**
 * useTelemetry - Hook to emit telemetry events
 * 
 * @example
 * ```tsx
 * const { emit } = useTelemetry();
 * 
 * const handleSend = (message: string) => {
 *   emit({
 *     type: 'message_sent',
 *     payload: { content: message, attachments: 0 }
 *   });
 * };
 * ```
 */
export const useTelemetry = (): TelemetryContextValue => {
    const context = useContext(TelemetryContext);

    if (!context) {
        // Fallback to no-op if provider is missing
        return {
            emit: () => { }, // Silent no-op
        };
    }

    return context;
};

TelemetryProvider.displayName = 'TelemetryProvider';
