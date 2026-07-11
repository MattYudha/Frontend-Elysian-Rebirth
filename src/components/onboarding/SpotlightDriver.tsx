"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const ONBOARDING_KEY = "hasSeenOnboarding";

export function SpotlightDriver() {
    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeen = localStorage.getItem(ONBOARDING_KEY);
        if (hasSeen) return;

        // Mark as seen immediately so it doesn't run again on re-render
        localStorage.setItem(ONBOARDING_KEY, "true");

        const driverObj = driver({
            showProgress: true,
            steps: [
                {
                    element: "#chat-input-area",
                    popover: {
                        title: "Start Here",
                        description: "Type your message here to begin a conversation with the AI.",
                        side: "top",
                        align: "start",
                    },
                },
                {
                    element: "[data-tour='sidebar']", // We'll need to add this data attribute to sidebar
                    popover: {
                        title: "Navigation",
                        description: "Access your chats, workflows, and settings here.",
                        side: "right",
                        align: "start",
                    },
                }
            ],
        });

        // Small delay to ensure elements are mounted
        setTimeout(() => {
            driverObj.drive();
        }, 1000);

    }, []);

    return null; // This component doesn't render anything visual itself
}
