"use client";

import { useEffect } from 'react';

type Command = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    action: () => void;
    shortcut?: string;
};

// Simple global event bus for commands
// In a real app, this might use Context or a specialized store
// For now, we'll use a custom event to broadcast command registration
export const COMMAND_REGISTER_EVENT = 'register-local-command';
export const COMMAND_UNREGISTER_EVENT = 'unregister-local-command';

export function useCommandRegistry(commands: Command[]) {
    useEffect(() => {
        // Dispatch event to register commands
        // This is a placeholder for the advanced logic where the GlobalCommandDialog
        // would listen to these events and update its state.
        // For Phase 1, we implemented the static GlobalCommandDialog.
        // This hook sets the stage for Phase 1.5 (Dynamic Injection).

        // TODO: Connect this to a global store (Zustand) that GlobalCommandDialog subscribes to.

        return () => {
            // Cleanup commands
        };
    }, [commands]);
}
