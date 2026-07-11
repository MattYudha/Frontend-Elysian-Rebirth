
import { http } from '@/lib/http';
import { User } from '@/lib/sdk/schemas/auth.schema';

// Types specifically for API Request/Response
interface AuthResponse {
    status: string;
    data: {
        access_token?: string;
        user: {
            id: string;
            name: string;
            email: string;
            // Backend might not return full user object on register/login initially, need to handle that
        };
    };
    message?: string;
}

interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

interface LoginDTO {
    email: string;
    password: string;
}

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterDTO): Promise<AuthResponse> {
        // Points to our Next.js API Proxy routes (Backend-for-Frontend)
        // This is crucial so Vercel can set the HttpOnly cookie for the SSR layout
        const response = await http.post<AuthResponse>('/api/auth/register', data, { baseURL: '' });
        return response;
    },

    /**
     * Login existing user
     */
    async login(data: LoginDTO): Promise<AuthResponse> {
        // Points to our Next.js API Proxy routes (Backend-for-Frontend)
        const response = await http.post<AuthResponse>('/api/auth/login', data, { baseURL: '' });
        // Authentication state is entirely managed by HttpOnly cookies established by the backend
        return response;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Point to BFF proxy to clear HttpOnly cookies set by Next.js
            await http.post('/api/auth/logout', {}, { baseURL: '' });
        } catch (error) {
            console.warn('Logout API failed', error);
        }
    },

    /**
     * Get current user profile (using token)
     */
    async getMe(): Promise<User> {
        const response = await http.get<{ status: string; data: User }>('/api/v1/users/me');
        // Adapt response if necessary to match User schema
        // For now assuming backend returns compatible structure
        return {
            ...response.data,
            // Fallbacks for fields not yet in backend user model
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            role: (response.data as any).role || 'viewer',
        };
    }
};
