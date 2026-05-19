'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft, Check, User, Briefcase, LayoutGrid, Loader2 } from 'lucide-react';

const businessTypes = [
    { id: 'umkm', label: 'UMKM / Bisnis Lokal', desc: 'Fokus pada efisiensi operasional harian' },
    { id: 'startup', label: 'Startup Teknologi', desc: 'Fokus pada inovasi dan skalabilitas cepat' },
    { id: 'enterprise', label: 'Enterprise / Korporasi', desc: 'Fokus pada tata kelola data & keamanan' },
    { id: 'personal', label: 'Personal / Freelance', desc: 'Fokus pada produktivitas individu AI' }
];

const features = [
    { id: 'chat', label: 'Chat AI Asisten', icon: '💬' },
    { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
    { id: 'workflow', label: 'Workflow Builder', icon: '⚡' },
    { id: 'editor', label: 'Smart Editor', icon: '✍️' }
];

export const SetupWizard = () => {
    const { 
        setupStep, 
        userProfile, 
        updateProfile, 
        nextSetupStep, 
        prevSetupStep, 
        completeSetup 
    } = useOnboardingStore();

    const { user, login } = useAuthStore();
    const [isSavingName, setIsSavingName] = useState(false);

    const progress = (setupStep / 3) * 100;

    // Update user name via BFF proxy → Backend PUT /api/v1/users/me
    const saveUserName = async (name: string) => {
        if (!name.trim()) return;
        setIsSavingName(true);
        try {
            const response = await fetch('/api/proxy/users/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: name.trim() }),
            });

            if (response.ok) {
                // Update the auth store so sidebar shows new name immediately
                if (user) {
                    login({ ...user, name: name.trim() }, useAuthStore.getState().accessToken || undefined);
                }
            }
            // Continue even if API fails — name will be updated next login
        } catch {
            // Non-critical — continue with onboarding
            console.warn('Failed to update user name via API');
        } finally {
            setIsSavingName(false);
        }
    };

    const handleNext = async () => {
        if (setupStep === 1 && userProfile.displayName.trim()) {
            // Save name to backend before advancing
            await saveUserName(userProfile.displayName);
        }
        
        if (setupStep === 3) {
            completeSetup();
        } else {
            nextSetupStep();
        }
    };

    const renderStep = () => {
        switch (setupStep) {
            case 1:
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Siapa Nama Anda?</h3>
                            <p className="text-slate-500 dark:text-slate-400">Nama ini akan digunakan sebagai nama profil Anda di Elysian.</p>
                        </div>
                        
                        <div className="max-w-md mx-auto">
                            <Input 
                                value={userProfile.displayName}
                                onChange={(e) => updateProfile({ displayName: e.target.value })}
                                placeholder="Masukkan nama lengkap Anda"
                                className="h-14 text-lg text-center rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-blue-500"
                            />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Apa Jenis Bisnis Anda?</h3>
                            <p className="text-slate-500 dark:text-slate-400">Konteks ini membantu asisten AI memberikan saran yang lebih relevan.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {businessTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => updateProfile({ businessType: type.id })}
                                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                                        userProfile.businessType === type.id 
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                                        : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    <p className={`font-bold ${userProfile.businessType === type.id ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {type.label}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{type.desc}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LayoutGrid className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Aktifkan Fitur Utama</h3>
                            <p className="text-slate-500 dark:text-slate-400">Pilih alat yang ingin Anda munculkan di dashboard utama.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            {features.map((f) => {
                                const isEnabled = userProfile.enabledFeatures.includes(f.id);
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => {
                                            const newList = isEnabled 
                                                ? userProfile.enabledFeatures.filter(id => id !== f.id)
                                                : [...userProfile.enabledFeatures, f.id];
                                            updateProfile({ enabledFeatures: newList });
                                        }}
                                        className={`relative p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${
                                            isEnabled 
                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                                            : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                        }`}
                                    >
                                        <span className="text-3xl">{f.icon}</span>
                                        <span className="font-bold text-sm tracking-tight dark:text-slate-200">{f.label}</span>
                                        {isEnabled && (
                                            <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-slate-50 dark:bg-[#060D18] flex items-center justify-center p-4 transition-colors duration-500">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl shadow-blue-900/10 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 overflow-hidden relative transition-colors duration-500">
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    />
                </div>

                <div className="p-8 md:p-12">
                    <div className="min-h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 -mx-8 -mb-8 p-6 md:px-12 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
                        <button
                            onClick={prevSetupStep}
                            disabled={setupStep === 1}
                            className={`flex items-center gap-2 font-bold transition-all ${setupStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <ArrowLeft className="w-5 h-5" /> Kembali
                        </button>

                        <div className="flex gap-4">
                            <Button 
                                onClick={handleNext}
                                disabled={(setupStep === 1 && !userProfile.displayName) || isSavingName}
                                className="h-12 px-8 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2"
                            >
                                {isSavingName && <Loader2 className="w-4 h-4 animate-spin" />}
                                {setupStep === 3 ? 'Selesaikan Setup' : 'Lanjut'} 
                                {setupStep === 3 ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
