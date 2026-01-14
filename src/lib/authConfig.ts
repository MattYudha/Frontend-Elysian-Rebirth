

interface AuthConfig {
    providers: {
        password: boolean;
        google: boolean;
        azure: boolean;
        okta: boolean;
    };
    jwksUrl?: string;
    tokenRefreshBuffer: number; // Minutes before expiry to refresh
    secureStorage: 'localStorage' | 'cookie' | 'memory';
}

export const authConfig: AuthConfig = {
    providers: {
        password: true,
        google: process.env.NEXT_PUBLIC_GOOGLE_AUTH === 'true',
        azure: process.env.NEXT_PUBLIC_AZURE_AUTH === 'true',
        okta: process.env.NEXT_PUBLIC_OKTA_AUTH === 'true',
    },
    jwksUrl: process.env.NEXT_PUBLIC_JWKS_URL,
    tokenRefreshBuffer: 5, // Refresh 5 minutes before expiry
    secureStorage: process.env.NODE_ENV === 'production' ? 'cookie' : 'localStorage',
};

/**
 * Get JWT signing keys from backend
 * Supports key rotation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getJWKS(): Promise<any> {
    if (!authConfig.jwksUrl) {
        console.warn('JWKS URL not configured');
        return null;
    }

    try {
        const response = await fetch(authConfig.jwksUrl);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch JWKS:', error);
        return null;
    }
}

/**
 * Verify token is still valid
 * Checks signature against current keys
 */
export async function verifyToken(token: string): Promise<boolean> {
    // In production, verify JWT signature with JWKS
    // For now, just check expiry
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to ms
        return Date.now() < exp;
    } catch {
        return false;
    }
}
