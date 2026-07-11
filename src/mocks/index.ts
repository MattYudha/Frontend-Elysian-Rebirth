async function initMocks() {
    if (typeof window === 'undefined') {
        // Node environment (can add server worker here if needed for SSR)
    } else {
        const { worker } = await import('./browser');
        await worker.start({
            onUnhandledRequest: 'bypass',
        });
    }
}

export { initMocks };
