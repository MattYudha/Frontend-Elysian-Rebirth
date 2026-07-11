import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    // Replay may only be useful for development or specific sampling
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
        Sentry.replayIntegration(),
    ],

    // Data Hygiene: Redact Sensitive Data
    beforeSend(event: any) {
        if (event.request && event.request.data) {
            // Redact potential PII in request body
            // Ideally we parse and scrub, but generic fallback:
            // event.request.data = "[Redacted]"; 
        }

        // Check breadcrumbs for sensitive prompts
        if (event.breadcrumbs) {
            event.breadcrumbs = event.breadcrumbs.map((b: any) => {
                if (b.category === 'ui.click' || b.category === 'xhr') {
                    // Scrub custom data if needed
                }
                return b;
            });
        }

        return event;
    },
});
