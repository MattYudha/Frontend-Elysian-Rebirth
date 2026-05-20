import { http } from '@/lib/http';
import { User } from '@/lib/sdk/schemas/auth.schema';

export interface UpdateUserDTO {
    name?: string;
    avatar_url?: string;
}

export interface UpdateUserResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar_url?: string;
        is_active: boolean;
        created_at: string;
    };
}

export interface UserPreferences {
    theme: string;
    language: string;
    notifications_enabled: boolean;
}

export interface UpdatePasswordDTO {
    old_password?: string;
    new_password?: string;
}

export const userService = {
    /**
     * Updates the authenticated user's profile
     */
    updateProfile: async (data: UpdateUserDTO): Promise<UpdateUserResponse> => {
        return http.put<UpdateUserResponse>('/api/v1/users/me', data);
    },

    /**
     * Gets the current authenticated user's fresh data from the backend
     */
    getMe: async (): Promise<{ status: string; data: User }> => {
        return http.get<{ status: string; data: User }>('/api/v1/users/me');
    },

    /**
     * Gets user preferences
     */
    getPreferences: async (): Promise<UserPreferences> => {
        const response = await http.get<{ status: string; data: UserPreferences }>('/api/v1/users/me/preferences');
        return response.data;
    },

    /**
     * Updates user preferences
     */
    updatePreferences: async (prefs: Partial<UserPreferences>): Promise<UserPreferences> => {
        const response = await http.put<{ status: string; data: UserPreferences }>('/api/v1/users/me/preferences', prefs);
        return response.data;
    },

    /**
     * Updates user password
     */
    updatePassword: async (data: UpdatePasswordDTO): Promise<{ message: string }> => {
        const response = await http.put<{ message: string }>('/api/v1/users/me/password', data);
        return response;
    }
};
