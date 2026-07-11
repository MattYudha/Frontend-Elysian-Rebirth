import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().optional(),
    roles: z.array(z.string()),
    tenantId: z.string().optional(),
});

export const loginResponseSchema = z.object({
    user: userSchema,
    token: z.string(),
    refreshToken: z.string().optional(),
    expiresIn: z.number(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
