import { http } from '@/lib/http';
import { User } from '@/lib/sdk/schemas/auth.schema';

export interface UpdateUserDTO {
    name?: string;
    avatar_url?: string;
    bio?: string;
    links?: string[];
}

export interface UpdateUserResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar_url?: string;
        bio: string;
        links: string[];
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
    current_password?: string;
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
    getMe: async (): Promise<{ status: string; data: User & { bio: string; links: string[] } }> => {
        const response = await http.get<{ status: string; data: any }>('/api/v1/users/me');
        const rawUser = response.data;
        const mappedUser = {
            ...rawUser,
            name: rawUser.name || rawUser.full_name || '',
            avatar: rawUser.avatar || rawUser.avatar_url || '',
            bio: rawUser.bio || '',
            links: Array.isArray(rawUser.links) ? rawUser.links : [],
        };
        return {
            status: response.status,
            data: mappedUser,
        };
    },

    /**
     * Gets user preferences
     */
    getPreferences: async (): Promise<UserPreferences> => {
        const response = await http.get<{ status: string; data: any }>('/api/v1/users/me/preferences');
        const rawPrefs = response.data;
        
        let notifEnabled = true;
        if (rawPrefs.notifications) {
            // Support both standard JSON string parsing or direct object
            const notifs = typeof rawPrefs.notifications === 'string' 
                ? JSON.parse(rawPrefs.notifications) 
                : rawPrefs.notifications;
            notifEnabled = notifs.email !== false;
        }

        return {
            theme: rawPrefs.appearance || 'system',
            language: 'en',
            notifications_enabled: notifEnabled,
        };
    },

    /**
     * Updates user preferences
     */
    updatePreferences: async (prefs: Partial<UserPreferences>): Promise<UserPreferences> => {
        const payload: any = {};
        if (prefs.theme) {
            payload.appearance = prefs.theme;
        }
        if (prefs.notifications_enabled !== undefined) {
            payload.notifications = {
                email: prefs.notifications_enabled,
                inApp: true,
                recommended: true
            };
        }

        const response = await http.put<{ status: string; data: any }>('/api/v1/users/me/preferences', payload);
        const rawPrefs = response.data;

        let notifEnabled = true;
        if (rawPrefs.notifications) {
            const notifs = typeof rawPrefs.notifications === 'string' 
                ? JSON.parse(rawPrefs.notifications) 
                : rawPrefs.notifications;
            notifEnabled = notifs.email !== false;
        }

        return {
            theme: rawPrefs.appearance || 'system',
            language: 'en',
            notifications_enabled: notifEnabled,
        };
    },

    /**
     * Updates user password
     */
    updatePassword: async (data: UpdatePasswordDTO): Promise<{ message: string }> => {
        // Backend expects 'current_password' and 'new_password'
        const response = await http.put<{ message: string }>('/api/v1/users/me/password', data);
        return response;
    }
};
