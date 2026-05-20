import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UserPreferences, type UpdatePasswordDTO } from '@/services/user.service';
import { toast } from 'sonner';

export const userKeys = {
    all: ['user'] as const,
    preferences: () => [...userKeys.all, 'preferences'] as const,
};

export function useUserPreferences() {
    return useQuery({
        queryKey: userKeys.preferences(),
        queryFn: userService.getPreferences,
        staleTime: 300_000,
    });
}

export function useUpdateUserPreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (prefs: Partial<UserPreferences>) => userService.updatePreferences(prefs),
        onSuccess: (data) => {
            queryClient.setQueryData(userKeys.preferences(), data);
            toast.success('Preferences updated successfully.');
        },
        onError: () => {
            toast.error('Failed to update preferences.');
        }
    });
}

export function useUpdatePassword() {
    return useMutation({
        mutationFn: (data: UpdatePasswordDTO) => userService.updatePassword(data),
        onSuccess: () => {
            toast.success('Password updated successfully.');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || 'Failed to update password.');
        }
    });
}
