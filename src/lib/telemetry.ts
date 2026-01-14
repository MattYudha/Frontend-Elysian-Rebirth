import { message } from 'antd';

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
    | 'error.occurred';

interface TelemetryEvent {
    type: EventType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
    timestamp: number;
    userId?: string;
}

class TelemetryService {
    private events: TelemetryEvent[] = [];
    private enabled: boolean = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track(type: EventType, payload?: any) {
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

// Convenience functions
export const toast = {
    success: (msg: string) => {
        message.success(msg);
        telemetry.track('user.login', { message: msg });
    },
    error: (msg: string) => {
        message.error(msg);
        telemetry.track('error.occurred', { message: msg });
    },
    warning: (msg: string) => {
        message.warning(msg);
    },
    info: (msg: string) => {
        message.info(msg);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loading: (msg: string, key?: string, _metadata?: Record<string, any>) => {
        return message.loading({ content: msg, key, duration: 0 });
    },
};
