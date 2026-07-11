import { z } from 'zod';

export const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters.'),
    jobTitle: z.string().optional(),
    phone: z.string().min(8, 'Phone number typically requires at least 8 digits').optional().or(z.literal('')),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters.').optional(),
    avatar: z.string().nullable().optional(),
    links: z.array(z.string().url('Must be a valid URL')).optional()
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
