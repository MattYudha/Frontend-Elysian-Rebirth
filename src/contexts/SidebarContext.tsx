'use client';

import React, { createContext, useContext, useState } from 'react';

type SidebarContextType = {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    open: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    // Default to open on desktop
    const [isOpen, setIsOpen] = useState(true);

    // Initial check for mobile not needed as we use CSS media queries for mobile hiding usually,
    // but for desktop collapse state persistence, we can add local storage later if needed.

    const toggle = () => setIsOpen(prev => !prev);
    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
