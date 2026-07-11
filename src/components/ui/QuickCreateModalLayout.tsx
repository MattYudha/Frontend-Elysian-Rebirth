"use client"

import React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface QuickCreateModalLayoutProps {
    open: boolean
    onClose: () => void
    isDescriptionExpanded?: boolean
    onSubmitShortcut?: () => void
    className?: string
    contentClassName?: string
    children: React.ReactNode
}

export function QuickCreateModalLayout({
    open,
    onClose,
    isDescriptionExpanded,
    onSubmitShortcut,
    className,
    contentClassName,
    children,
}: QuickCreateModalLayoutProps) {
    if (!open) return null

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!onSubmitShortcut) return

        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault()
            onSubmitShortcut()
        }
    }

    // Elysian Soft Blue Glassmorphism Re-design
    // Replaced bg-black/50 with bg-slate-900/20 backdrop-blur-sm
    // Replaced bg-background border-border with bg-white/70 backdrop-blur-md border-blue-100/50 shadow-xl shadow-blue-900/5
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 dark:bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    height: isDescriptionExpanded ? "85vh" : "auto",
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={cn(
                    "flex w-full max-w-[720px] rounded-3xl bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-md shadow-xl shadow-blue-900/5 dark:shadow-black/20 border border-blue-100/50 dark:border-blue-900/30",
                    className,
                )}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
            >
                <div className={cn("flex flex-1 flex-col p-4 gap-3.5", contentClassName)}>{children}</div>
            </motion.div>
        </div>
    )
}
