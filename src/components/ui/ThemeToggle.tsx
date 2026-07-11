"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-[64px] h-[32px] rounded-full bg-slate-200 dark:bg-slate-800 opacity-50 animate-pulse border border-slate-300 dark:border-slate-700" />
        )
    }

    const isDark = resolvedTheme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="group relative flex h-[32px] w-[64px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:outline-none focus:outline-none border overflow-hidden"
            style={{
                backgroundColor: isDark ? "#0f172a" : "#e2e8f0", // slate-900 / slate-200
                borderColor: isDark ? "#1e293b" : "#cbd5e1" // slate-800 / slate-300
            }}
            aria-label="Toggle dark mode"
        >
            {/* Background Animations */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-full transition-colors duration-300">
                {/* Stars for dark mode */}
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isDark ? 1 : 0,
                        y: isDark ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-start pl-2"
                >
                    <div className="relative h-full w-full">
                        <motion.div
                            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1 top-2.5 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_2px_1px_rgba(255,255,255,0.8)]"
                        />
                        <motion.div
                            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.7, 1, 0.7] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute left-4 top-1.5 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_2px_1px_rgba(255,255,255,0.6)]"
                        />
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute left-2.5 top-5 h-[1.5px] w-[1.5px] rounded-full bg-white shadow-[0_0_3px_1px_rgba(255,255,255,0.9)]"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            className="absolute left-6 top-5 h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_2px_1px_rgba(255,255,255,0.6)]"
                        />
                    </div>
                </motion.div>

                {/* Clouds/Sky for light mode */}
                <motion.div
                    initial={false}
                    animate={{
                        opacity: isDark ? 0 : 1,
                        x: isDark ? -10 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                >
                    <div className="absolute right-1.5 top-1.5 w-3 h-1 bg-white rounded-full opacity-70" />
                    <div className="absolute right-3 top-2.5 w-4 h-1.5 bg-white rounded-full opacity-90" />
                    <div className="absolute right-1 top-4 w-2 h-1 bg-white rounded-full opacity-60" />
                </motion.div>
            </div>

            {/* Sliding Thumb */}
            <motion.div
                className="relative z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white transition-shadow duration-300"
                initial={false}
                animate={{
                    x: isDark ? 16 : -16, // slider travel distance for 64w
                    backgroundColor: isDark ? "#ffffff" : "#ffffff",
                    boxShadow: isDark
                        ? "0px 0px 12px 3px rgba(56, 189, 248, 0.6), inset 0px -2px 4px rgba(0,0,0,0.1)"  // Glowing blue
                        : "0px 2px 4px 0px rgba(0, 0, 0, 0.1), inset 0px -2px 4px rgba(0,0,0,0.05)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
            >
                {/* Thumb Inner Icon */}
                <div className="relative h-full w-full flex items-center justify-center">
                    {/* Moon Icon */}
                    <motion.div
                        className="absolute flex items-center justify-center text-sky-500"
                        initial={false}
                        animate={{
                            opacity: isDark ? 1 : 0,
                            rotate: isDark ? 0 : -90,
                            scale: isDark ? 1 : 0.5
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Moon fill="currentColor" size={13} className="ml-[1px] mt-[1px]" />
                    </motion.div>

                    {/* Sun Icon */}
                    <motion.div
                        className="absolute flex items-center justify-center text-amber-500"
                        initial={false}
                        animate={{
                            opacity: isDark ? 0 : 1,
                            rotate: isDark ? 90 : 0,
                            scale: isDark ? 0.5 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <Sun fill="currentColor" size={14} />
                    </motion.div>
                </div>
            </motion.div>
        </button>
    )
}
