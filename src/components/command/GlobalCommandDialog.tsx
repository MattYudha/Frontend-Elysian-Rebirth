"use client";

import * as React from "react";
import {
    Settings,
    Moon,
    Sun,
    Monitor,
    Home,
    FileText,
    Bot,
    LayoutDashboard
} from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from '@/store/authStore';

export function GlobalCommandDialog() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();
    const { isAuthenticated } = useAuthStore();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        const openDialog = () => setOpen(true);

        document.addEventListener("keydown", down);
        document.addEventListener("open-command-dialog", openDialog);

        return () => {
            document.removeEventListener("keydown", down);
            document.removeEventListener("open-command-dialog", openDialog);
        };
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    const handleNavigation = (path: string, isProtected: boolean = false) => {
        runCommand(() => {
            if (isProtected && !isAuthenticated) {
                router.push('/login');
            } else {
                router.push(path);
            }
        });
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => handleNavigation("/dashboard", true)}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                        <CommandShortcut>⌘D</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => handleNavigation("/chat", true)}>
                        <Bot className="mr-2 h-4 w-4" />
                        <span>Chat AI</span>
                        <CommandShortcut>⌘C</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => handleNavigation("/knowledge", true)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Knowledge Base</span>
                    </CommandItem>
                    <CommandItem onSelect={() => handleNavigation("/settings", true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => handleNavigation("/", false)}>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Theme">
                    <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light Mode</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>System</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
