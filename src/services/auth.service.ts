
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
        const response = await http.post<AuthResponse>('/api/v1/auth/register', data);
        return response;
    },

    /**
     * Login existing user
     */
    async login(data: LoginDTO): Promise<AuthResponse> {
        const response = await http.post<AuthResponse>('/api/v1/auth/login', data);

        // Save token to localStorage immediately upon success
        if (response.data && response.data.access_token) {
            localStorage.setItem('auth_token', response.data.access_token);
        }

        return response;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await http.post('/api/v1/auth/logout');
        } catch (error) {
            console.warn('Logout API failed, cleaning up local storage anyway', error);
        } finally {
            localStorage.removeItem('auth_token');
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
