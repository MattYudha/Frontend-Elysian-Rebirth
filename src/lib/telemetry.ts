import { toast as sonnerToast } from 'sonner';

type EventType =
    | 'chat.send'
    | 'chat.receive'
    | 'rag.query'
    | 'rag.upload'
    | 'doc.edit'
    | 'doc.save'
    | 'workflow.node.add'
    | 'workflow.execute'
    | 'user.login'
    | 'user.logout'
    | 'user.debug'
    | 'error.occurred';

interface TelemetryEvent {
    type: EventType;
    payload?: Record<string, unknown>;
    timestamp: number;
    userId?: string;
}

class TelemetryService {
    private events: TelemetryEvent[] = [];
    private enabled: boolean = true;

    track(type: EventType, payload?: Record<string, unknown>) {
        if (!this.enabled) return;

        const event: TelemetryEvent = {
            type,
            payload,
            timestamp: Date.now(),
            userId: this.getUserId(),
        };

        this.events.push(event);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Telemetry]', event);
        }

        // In production, send to backend
        // this.sendToBackend(event);
    }

    private getUserId(): string | undefined {
        if (typeof window === 'undefined') return undefined;
        const user = localStorage.getItem('auth_user');
        if (!user) return undefined;

        try {
            return JSON.parse(user).id;
        } catch {
            return undefined;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private async sendToBackend(event: TelemetryEvent) {
        // TODO: Implement backend telemetry endpoint
        // await fetch('/api/telemetry', {
        //   method: 'POST',
        //   body: JSON.stringify(event),
        // });
    }

    getEvents(): TelemetryEvent[] {
        return this.events;
    }

    clearEvents() {
        this.events = [];
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }
}

export const telemetry = new TelemetryService();

// Convenience functions (Adapter for previous Antd usage)
export const toast = {
    success: (msg: string) => {
        sonnerToast.success(msg);
        telemetry.track('user.login', { message: msg });
    },
    error: (msg: string) => {
        sonnerToast.error(msg);
        telemetry.track('error.occurred', { message: msg });
    },
    warning: (msg: string) => {
        sonnerToast.warning(msg);
    },
    info: (msg: string) => {
        sonnerToast.info(msg);
    },
    loading: (msg: string, key?: string | number, _metadata?: Record<string, unknown>) => {
        const id = sonnerToast.loading(msg, { id: key });
        return {
            update: (params: { content?: string, type?: 'success' | 'error' | 'info' }) => {
                if (params.type === 'success') sonnerToast.success(params.content || msg, { id });
                else if (params.type === 'error') sonnerToast.error(params.content || msg, { id });
                else sonnerToast.message(params.content || msg, { id });
            },
            destroy: () => sonnerToast.dismiss(id),
            // Maintain Antd message compatibility if possible, though return type differs slightly
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            then: (_resolve: (value: unknown) => void, _reject: (reason?: unknown) => void) => { /* dummy */ },
        };
    },
};
