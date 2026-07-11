'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight, ArrowLeft, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TourStep {
    targetSelector: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface GuidedTourProps {
    steps: TourStep[];
    tourKey: string; // unique key to save in localStorage (e.g. 'dashboard_tour', 'editor_tour')
    autoStartDelay?: number;
}

export function GuidedTour({ steps, tourKey, autoStartDelay = 1500 }: GuidedTourProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
    const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number } | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Check if the tour has been completed before
    useEffect(() => {
        const hasCompleted = localStorage.getItem(`elysian_tour_${tourKey}`);
        if (!hasCompleted) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, autoStartDelay);
            return () => clearTimeout(timer);
        }
    }, [tourKey, autoStartDelay]);

    // Recalculate target element position
    useEffect(() => {
        if (!isOpen || steps.length === 0) return;

        const activeStepObj = steps[currentStep];
        const targetEl = document.querySelector(activeStepObj.targetSelector);

        if (!targetEl) {
            // Target element is not found, fallback to center of the screen
            setCoords(null);
            setPopoverCoords(null);
            return;
        }

        const updatePosition = () => {
            const rect = targetEl.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            const elementCoords = {
                top: rect.top + scrollY,
                left: rect.left + scrollX,
                width: rect.width,
                height: rect.height,
            };

            setCoords(elementCoords);

            // Calculate popover coordinates based on position preference
            setTimeout(() => {
                if (!popoverRef.current) return;
                const popoverRect = popoverRef.current.getBoundingClientRect();
                const margin = 12;
                let top = 0;
                let left = 0;

                const pos = activeStepObj.position || 'bottom';

                if (pos === 'bottom') {
                    top = elementCoords.top + elementCoords.height + margin;
                    left = elementCoords.left + (elementCoords.width / 2) - (popoverRect.width / 2);
                } else if (pos === 'top') {
                    top = elementCoords.top - popoverRect.height - margin;
                    left = elementCoords.left + (elementCoords.width / 2) - (popoverRect.width / 2);
                } else if (pos === 'left') {
                    top = elementCoords.top + (elementCoords.height / 2) - (popoverRect.height / 2);
                    left = elementCoords.left - popoverRect.width - margin;
                } else if (pos === 'right') {
                    top = elementCoords.top + (elementCoords.height / 2) - (popoverRect.height / 2);
                    left = elementCoords.left + elementCoords.width + margin;
                } else {
                    // Center
                    top = window.innerHeight / 2 - popoverRect.height / 2 + scrollY;
                    left = window.innerWidth / 2 - popoverRect.width / 2 + scrollX;
                }

                // Boundary collision checks (keep within viewport)
                const padding = 16;
                if (left < padding) left = padding;
                if (left + popoverRect.width > window.innerWidth - padding) {
                    left = window.innerWidth - popoverRect.width - padding;
                }
                if (top < padding) top = padding;

                setPopoverCoords({ top, left });
            }, 50);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        // Periodically check if coordinates changed (e.g. elements expanding)
        const interval = setInterval(updatePosition, 300);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
            clearInterval(interval);
        };
    }, [isOpen, currentStep, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        setIsOpen(false);
        localStorage.setItem(`elysian_tour_${tourKey}`, 'completed');
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleRestart = () => {
        setCurrentStep(0);
        setIsOpen(true);
    };

    if (!isOpen) {
        // Render a small floating "Mulai Tur" button in the corner to trigger manual restarts
        return (
            <button
                onClick={handleRestart}
                className="fixed bottom-20 right-6 z-[45] flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-xs"
                title="Mulai Panduan Antarmuka"
            >
                <HelpCircle className="h-4 w-4 animate-bounce" />
                <span>Panduan UX</span>
            </button>
        );
    }

    const activeStepObj = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none select-none">
            {/* Dark Spotlight Backdrop Overlay */}
            {coords && (
                <div
                    className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 pointer-events-auto transition-all duration-300"
                    style={{
                        clipPath: `polygon(
                            0% 0%, 
                            0% 100%, 
                            ${coords.left}px 100%, 
                            ${coords.left}px ${coords.top}px, 
                            ${coords.left + coords.width}px ${coords.top}px, 
                            ${coords.left + coords.width}px ${coords.top + coords.height}px, 
                            ${coords.left}px ${coords.top + coords.height}px, 
                            ${coords.left}px 100%, 
                            100% 100%, 
                            100% 0%
                        )`,
                    }}
                    onClick={handleSkip}
                />
            )}

            {!coords && (
                // Fullscreen dim overlay when no coordinate target is selected (center steps)
                <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 pointer-events-auto transition-all duration-300" onClick={handleSkip} />
            )}

            {/* Guided Tour Popover Card */}
            <div
                ref={popoverRef}
                style={{
                    position: 'absolute',
                    top: popoverCoords ? `${popoverCoords.top}px` : '50%',
                    left: popoverCoords ? `${popoverCoords.left}px` : '50%',
                    transform: popoverCoords ? 'none' : 'translate(-50%, -50%)',
                }}
                className={cn(
                    "w-[340px] max-w-[calc(100vw-32px)] pointer-events-auto transition-all duration-300 z-[101]",
                    !popoverCoords && "fixed"
                )}
            >
                <Card className="p-5 border border-blue-200 dark:border-blue-900/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden flex flex-col gap-4">
                    {/* Glowing highlight accents */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/5 blur-2xl rounded-full pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                                <Sparkles className="h-4 w-4 animate-spin-slow" />
                            </div>
                            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Elysian Tour Guide
                            </span>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Step Title & Progress */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold">
                            <span>Langkah {currentStep + 1} dari {steps.length}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-50">
                            {activeStepObj.title}
                        </h4>
                    </div>

                    {/* Step Content */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {activeStepObj.content}
                    </p>

                    {/* Progress Bar Indicators */}
                    <div className="flex gap-1.5 h-1 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex-1 h-full rounded-full transition-all duration-300",
                                    idx <= currentStep ? "bg-blue-500" : "bg-transparent"
                                )}
                            />
                        ))}
                    </div>

                    {/* Actions footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-blue-950/20">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 h-8"
                        >
                            Lewati
                        </Button>

                        <div className="flex items-center gap-1.5">
                            {currentStep > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrev}
                                    className="h-8 w-8 p-0 border-slate-200 dark:border-blue-900/30 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/40"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                </Button>
                            )}

                            <Button
                                size="sm"
                                onClick={handleNext}
                                className="h-8 px-3.5 gap-1 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-xs shadow-lg shadow-blue-500/10"
                            >
                                <span>{currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
