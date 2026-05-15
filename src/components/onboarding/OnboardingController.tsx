'use client';

import React, { useEffect, useState } from 'react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { WelcomeScreen } from './WelcomeScreen';
import { SetupWizard } from './SetupWizard';
import { OnboardingWidget } from './OnboardingWidget';
import { AnimatePresence } from 'framer-motion';

export const OnboardingController = () => {
    const { 
        currentPhase, 
        startOnboarding, 
        isCompleted, 
        syncProgress 
    } = useOnboardingStore();
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        syncProgress();
        
        // Detect first-time login flag from registration
        const isFirstLogin = localStorage.getItem('elysian-first-login');
        if (isFirstLogin === 'true' && !isCompleted) {
            startOnboarding();
            localStorage.removeItem('elysian-first-login'); // Consume flag
        }
    }, [isCompleted, startOnboarding, syncProgress]);

    if (!isMounted) return null;

    return (
        <AnimatePresence mode="wait">
            {currentPhase === 'welcome' && <WelcomeScreen key="welcome" />}
            {currentPhase === 'setup' && <SetupWizard key="setup" />}
            {currentPhase === 'tour' && <OnboardingWidget key="tour" />}
        </AnimatePresence>
    );
};
