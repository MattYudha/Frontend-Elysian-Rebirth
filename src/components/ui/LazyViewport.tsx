'use client';

import { useInView } from "framer-motion";
import { useRef, ReactNode, useState, useEffect } from "react";

interface LazyViewportProps {
    children: ReactNode;
    threshold?: number;
    rootMargin?: string;
    minHeight?: string;
    placeholder?: ReactNode;
}

/**
 * LazyViewport optimizes performance by only mounting/rendering its children 
 * when they enter or are about to enter the viewport (rootMargin).
 * 
 * Significant for reducing:
 * 1. Initial DOM tree size
 * 2. Background animation CPU usage
 * 3. Asset loading (if children contain images)
 */
export function LazyViewport({
    children,
    threshold = 0.05,
    rootMargin = "400px 0px", // Load 400px before it enters view for smooth experience
    minHeight = "200px",
    placeholder
}: LazyViewportProps) {
    const ref = useRef(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });
    const [hasRendered, setHasRendered] = useState(false);

    useEffect(() => {
        if (isInView) {
            setHasRendered(true);
        }
    }, [isInView]);

    return (
        <div ref={ref} style={{ minHeight: hasRendered ? "auto" : minHeight }}>
            {hasRendered ? (
                children
            ) : (
                placeholder || <div className="w-full h-full opacity-0" />
            )}
        </div>
    );
}
