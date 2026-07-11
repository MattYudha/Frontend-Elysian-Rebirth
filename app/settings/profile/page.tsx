'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, X, Loader2, Link2 } from 'lucide-react';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettingsUiStore } from '@/store/ui/settingsStore';

// ─── Schema ──────────────────────────────────────────────────────────────────
const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters.'),
    lastName:  z.string().min(1, 'Last name is required.'),
    bio:       z.string().max(500, 'Bio cannot exceed 500 characters.').default(''),
    avatar:    z.string().nullable().optional(),
    links:     z.array(
        z.object({ url: z.string().url('Must be a valid URL').or(z.literal('')) })
    ).default([]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, login } = useAuthStore();
    const [hasHydrated, setHasHydrated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { setDirty } = useSettingsUiStore();

    const form = useForm<ProfileFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(profileSchema) as any,
        defaultValues: {
            firstName: '',
            lastName:  '',
            bio:       '',
            avatar:    undefined,
            links:     [],
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = form;

    const { fields, append, remove } = useFieldArray({ control, name: 'links' });
    const currentAvatar = watch('avatar');
    const bioValue = watch('bio');

    // ── Load fresh profile data from API ──────────────────────────────────
    const loadProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await userService.getMe();
            const freshUser = response.data;

            // `name` is always present; bio/links are our new extended fields
            const nameParts = (freshUser.name || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName  = nameParts.slice(1).join(' ') || '';

            const links = (freshUser.links || []).map((url: string) => ({ url }));

            form.reset({
                firstName,
                lastName,
                bio:    freshUser.bio || '',
                avatar: freshUser.avatar || undefined,
                links,
            });
        } catch (err) {
            console.error('Failed to load profile', err);
        } finally {
            setIsLoading(false);
            setHasHydrated(true);
        }
    }, [form]);

    useEffect(() => {
        loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Track dirty state ─────────────────────────────────────────────────
    useEffect(() => {
        setDirty('/settings/profile', isDirty);
        return () => setDirty('/settings/profile', false);
    }, [isDirty, setDirty]);

    // ── Submit ────────────────────────────────────────────────────────────
    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const fullName = `${data.firstName} ${data.lastName}`.trim();
            const links    = (data.links || []).map(l => l.url).filter(Boolean);

            const payload = {
                name:       fullName,
                avatar_url: data.avatar || undefined,
                bio:        data.bio || '',
                links,
            };

            const response = await userService.updateProfile(payload);

            // Sync auth store
            if (user) {
                login({
                    ...user,
                    name:   response.user.name,
                    avatar: response.user.avatar_url || undefined,
                });
            }

            form.reset(data); // Resets isDirty
            toast.success('Profil berhasil diperbarui', {
                description: 'Bio dan link sosial tersinkronisasi ke database.',
            });
        } catch (error) {
            console.error('Failed to update profile', error);
            toast.error('Gagal memperbarui profil', {
                description: 'Terjadi kesalahan internal. Silakan coba lagi.',
            });
        }
    };

    // ── Avatar upload ─────────────────────────────────────────────────────
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File terlalu besar (Max 5MB)');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setValue('avatar', reader.result as string, { shouldDirty: true });
        };
        reader.readAsDataURL(file);
    };

    // ── Loading skeleton ──────────────────────────────────────────────────
    if (!hasHydrated || isLoading) {
        return (
            <div className="flex items-center justify-center p-12 text-slate-500 gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm">Loading profile settings...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto md:mx-0">
            <div className="flex flex-col gap-8">
                <div className="flex-1 min-w-0 space-y-8 max-w-2xl">
                    {/* Intro */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Update your personal details that will be displayed on your public profile.
                        </p>
                    </div>

                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <form onSubmit={handleSubmit(onSubmit as any)} className="bg-transparent p-0">
                        {/* Avatar Row */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                            <Avatar className="h-20 w-20 border border-slate-200 dark:border-slate-700">
                                <AvatarImage src={currentAvatar || ''} className="object-cover" />
                                <AvatarFallback className="text-xl bg-slate-100 dark:bg-slate-800">
                                    {form.getValues('firstName')?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                    >
                                        Upload New
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => setValue('avatar', null, { shouldDirty: true })}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400">Recommended: Square JPG, PNG. Max 1MB.</p>
                                <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 max-w-xl">
                            {/* Name Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                                    <Input
                                        id="firstName"
                                        {...register('firstName')}
                                        className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                                    />
                                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                                    <p className="text-[13px] text-slate-500">This is your public display name.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        {...register('lastName')}
                                        className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                                    />
                                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            {/* Email (read-only) */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="h-10 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-md text-slate-500"
                                />
                                <p className="text-[13px] text-slate-500">
                                    Your email address cannot be changed from the profile page.
                                </p>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                                    <span className="text-xs text-slate-400">
                                        {(bioValue || '').length}/500
                                    </span>
                                </div>
                                <textarea
                                    id="bio"
                                    {...register('bio')}
                                    rows={4}
                                    className="w-full min-h-[120px] p-3 text-sm bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y transition-colors"
                                    placeholder="Tell us a little bit about yourself…"
                                />
                                {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
                                <p className="text-[13px] text-slate-500">
                                    You can @mention other users and organizations to link to them.
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Social Links</h3>
                                        <p className="text-[13px] text-slate-500 mt-0.5">
                                            Add links to your website, blog, or social media profiles.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex items-center gap-2 group animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="flex items-center h-10 w-9 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 justify-center flex-shrink-0">
                                                <Link2 className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <Input
                                                {...register(`links.${index}.url`)}
                                                placeholder={
                                                    index === 0
                                                        ? 'https://elysian.app'
                                                        : index === 1
                                                        ? 'https://twitter.com/yourusername'
                                                        : 'https://...'
                                                }
                                                className="flex-1 h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-md focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => remove(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            {errors.links?.[index]?.url && (
                                                <p className="text-xs text-red-500">{errors.links[index]?.url?.message}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 transition-colors"
                                    onClick={() => append({ url: '' })}
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Link
                                </Button>
                            </div>

                            {/* Submit */}
                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isDirty}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-md shadow-blue-500/20 rounded-md px-6 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving…
                                        </>
                                    ) : (
                                        'Update profile'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
