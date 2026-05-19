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
        isCompleted, 
        syncProgress 
    } = useOnboardingStore();
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        syncProgress();
    }, [syncProgress]);

    // If user has completed onboarding or never started it, render nothing
    if (!isMounted || isCompleted || currentPhase === 'completed') return null;

    return (
        <AnimatePresence mode="wait">
            {currentPhase === 'welcome' && <WelcomeScreen key="welcome" />}
            {currentPhase === 'setup' && <SetupWizard key="setup" />}
            {currentPhase === 'tour' && <OnboardingWidget key="tour" />}
        </AnimatePresence>
    );
};
