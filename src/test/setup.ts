import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver (Commonly needed for shadcn/ui and Recharts)
globalThis.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock matchMedia (Needed for responsive hooks)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// Mock indexedDB support in JSDOM
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'indexedDB', {
        value: {},
        writable: true,
        configurable: true
    });
}

// Mock next/navigation
vi.mock('next/navigation', () => {
    const mockSearchParams = {
        get: vi.fn((key) => {
            if (key === 'id') return 'test-id';
            return null;
        }),
        has: vi.fn(() => false),
        forEach: vi.fn(),
    };
    return {
        useRouter: () => ({
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
        }),
        usePathname: () => '/test-path',
        useSearchParams: () => mockSearchParams,
    };
});
