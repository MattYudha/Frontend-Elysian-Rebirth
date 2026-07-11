'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/useIsMobile';

interface StarSprite {
    canvas: HTMLCanvasElement | OffscreenCanvas;
    width: number; // Logical width
    height: number; // Logical height
    isShape: boolean;
}

interface Star {
    x: number;
    y: number;
    baseRadius: number; // Visual scale factor
    velocity: number;
    alpha: number;
    targetAlpha: number;
    twinkleSpeed: number;
    parallaxFactor: number;
    sprite: StarSprite; // Reference to pre-rendered variant
    rotation: number;
    rotationSpeed: number;
    scaleOscillator: number;
}

// Draw the 4-point sparkle path exactly once
function drawStarPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, size: number) {
    const innerSize = size * 0.2; // 20% of outer size
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(innerSize / 2, -innerSize / 2, size, 0);
    ctx.quadraticCurveTo(innerSize / 2, innerSize / 2, 0, size);
    ctx.quadraticCurveTo(-innerSize / 2, innerSize / 2, -size, 0);
    ctx.quadraticCurveTo(-innerSize / 2, -innerSize / 2, 0, -size);
    ctx.closePath();
}

// Factory to create an offscreen canvas
function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
    if (typeof OffscreenCanvas !== 'undefined') {
        return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export function ElysianSpace() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useIsMobile();

    // Mouse tracking for parallax
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    const targetX = useRef(0);
    const targetY = useRef(0);

    useEffect(() => setMounted(true), []);
    const isDark = mounted && (resolvedTheme ?? theme) === 'dark';

    useEffect(() => {
        if (!mounted || !canvasRef.current || !isDark) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let width = 0;
        let height = 0;

        const colors = [
            'rgb(224, 242, 254)',   // blue-100
            'rgb(186, 230, 253)',   // sky-200
            'rgba(34, 211, 238, 0.9)',// cyan-400
            'rgb(147, 197, 253)'    // blue-300
        ];

        // --- SPRITE ATLAS GENERATION ---
        // Pre-render variations to avoid expensive operations per-frame
        const dpr = window.devicePixelRatio || 1;
        const spriteCache: { [key: string]: StarSprite } = {};

        const getOrCreateDotSprite = (sizeClass: 'small' | 'med' | 'large', color: string): StarSprite => {
            const cacheKey = `dot_${sizeClass}_${color}`;
            if (spriteCache[cacheKey]) return spriteCache[cacheKey];

            // Define base radii for classes
            let r = 0.4;
            let blur = 0;
            if (sizeClass === 'small') r = 0.3;
            else if (sizeClass === 'med') r = 0.8;
            else if (sizeClass === 'large') {
                r = 1.6;
                blur = 4; // Large stars glow
            }

            // Canvas size must accommodate the radius + blur, multiplied by DPR for Retina scaling
            const padding = blur * 2 + 2;
            const logicalSize = (r * 2) + padding;
            const physicalSize = logicalSize * dpr;

            const offCanvas = createOffscreenCanvas(physicalSize, physicalSize);
            const octx = offCanvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

            // Apply Retina scaling to the offscreen context
            octx.scale(dpr, dpr);

            const center = logicalSize / 2;

            octx.beginPath();
            octx.arc(center, center, r, 0, Math.PI * 2);

            if (blur > 0) {
                // Pre-bake the shadow blur into the sprite
                octx.shadowBlur = blur;
                octx.shadowColor = color;
            }

            octx.fillStyle = color;
            octx.fill();

            const sprite = { canvas: offCanvas, width: logicalSize, height: logicalSize, isShape: false };
            spriteCache[cacheKey] = sprite;
            return sprite;
        };

        const getOrCreateShapeSprite = (sizeClass: 'med' | 'large'): StarSprite => {
            const cacheKey = `shape_${sizeClass}`;
            if (spriteCache[cacheKey]) return spriteCache[cacheKey];

            // Define base radii for classes (These draw relatively large and we scale down in loop)
            const r = sizeClass === 'large' ? 10 : 6;
            const padding = r * 2; // Room for blur & stroke
            const logicalSize = (r * 2) + padding;
            const physicalSize = logicalSize * dpr;

            const offCanvas = createOffscreenCanvas(physicalSize, physicalSize);
            const octx = offCanvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
            octx.scale(dpr, dpr);

            const center = logicalSize / 2;

            octx.save();
            octx.translate(center, center);
            drawStarPath(octx, r);

            // Hot white core to cyan edge
            const gradient = octx.createRadialGradient(0, 0, 0, 0, 0, r);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            if (sizeClass === 'large') {
                gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
                octx.lineWidth = 0.5;
            } else {
                gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.5)');
                octx.lineWidth = 0.3;
            }
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

            octx.fillStyle = gradient;
            octx.fill();

            octx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            octx.stroke();
            octx.restore();

            const sprite = { canvas: offCanvas, width: logicalSize, height: logicalSize, isShape: true };
            spriteCache[cacheKey] = sprite;
            return sprite;
        };


        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            const numStars = isMobile ? 150 : 400;
            stars = [];

            for (let i = 0; i < numStars; i++) {
                const layer = Math.random();
                let parallaxFactor, velocity, baseRadius;
                let spriteVariant: StarSprite;

                const color = colors[Math.floor(Math.random() * colors.length)];

                if (layer < 0.1) {
                    parallaxFactor = 0.08;
                    velocity = 0.05;
                    // ~50% of the closest stars are shapes (~5% total)
                    if (Math.random() < 0.5) {
                        spriteVariant = getOrCreateShapeSprite('large');
                        baseRadius = Math.random() * 0.6 + 0.35; // Visual shape scale down (Smaller)
                    } else {
                        spriteVariant = getOrCreateDotSprite('large', color);
                        baseRadius = 1.0;
                    }
                } else if (layer < 0.3) {
                    parallaxFactor = 0.03;
                    velocity = 0.02;
                    // ~10% of mid stars are shapes (~2% total)
                    if (Math.random() < 0.1) {
                        spriteVariant = getOrCreateShapeSprite('med');
                        baseRadius = Math.random() * 0.35 + 0.2; // Visual shape scale down (Smaller)
                    } else {
                        spriteVariant = getOrCreateDotSprite('med', color);
                        baseRadius = Math.random() * 0.5 + 0.5; // Visual randomize scale
                    }
                } else {
                    parallaxFactor = 0.01;
                    velocity = 0.005;
                    spriteVariant = getOrCreateDotSprite('small', color);
                    baseRadius = Math.random() * 0.5 + 0.5; // Visual randomize scale
                }

                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    baseRadius: baseRadius,
                    velocity: velocity,
                    alpha: Math.random(),
                    targetAlpha: Math.random() * 0.5 + 0.5,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    parallaxFactor: parallaxFactor,
                    sprite: spriteVariant,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.005,
                    scaleOscillator: Math.random() * Math.PI * 2,
                });
            }
        };

        const render = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, width, height);

            targetX.current += (mouseX.current - targetX.current) * 0.05;
            targetY.current += (mouseY.current - targetY.current) * 0.05;

            // Optional: Bulk operation setting
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];

                if (Math.abs(s.alpha - s.targetAlpha) < 0.05) {
                    s.targetAlpha = Math.random() * 0.6 + 0.2;
                    s.twinkleSpeed = Math.random() * 0.01 + 0.002;
                }

                if (s.alpha < s.targetAlpha) s.alpha += s.twinkleSpeed;
                else s.alpha -= s.twinkleSpeed;

                s.y -= s.velocity;

                if (s.y < -30) s.y = height + 30;
                if (s.x < -30) s.x = width + 30;
                if (s.x > width + 30) s.x = -30;

                const pX = s.x + (targetX.current - width / 2) * s.parallaxFactor;
                const pY = s.y + (targetY.current - height / 2) * s.parallaxFactor;

                ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha));

                if (s.sprite.isShape) {
                    s.rotation += s.rotationSpeed;
                    s.scaleOscillator += 0.02;

                    const pulseScale = 1.0 + (Math.sin(s.scaleOscillator) * 0.15);
                    const finalScale = s.baseRadius * pulseScale;

                    ctx.save();
                    ctx.translate(pX, pY);
                    ctx.rotate(s.rotation);
                    ctx.scale(finalScale, finalScale);

                    // Draw sprite centered over 0,0
                    ctx.drawImage(
                        s.sprite.canvas,
                        -s.sprite.width / 2,
                        -s.sprite.height / 2,
                        s.sprite.width,
                        s.sprite.height
                    );

                    ctx.restore();
                } else {
                    // For typical dots, draw them directly scaled without translation 
                    // (drawImage offsets x/y automatically based on width/height divided by 2)
                    const w = s.sprite.width * s.baseRadius;
                    const h = s.sprite.height * s.baseRadius;
                    ctx.drawImage(s.sprite.canvas, pX - w / 2, pY - h / 2, w, h);
                }
            }

            ctx.globalAlpha = 1.0;
            animationFrameId = requestAnimationFrame(render);
        };

        const handleResize = () => { init(); };
        const handleMouseMove = (e: MouseEvent) => { mouseX.current = e.clientX; mouseY.current = e.clientY; };

        init();
        render();

        window.addEventListener('resize', handleResize);
        if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (!isMobile) window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mounted, isDark, isMobile]);


    return (
        <div
            className={[
                'fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-[800ms] ease-in-out',
                isDark ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            aria-hidden
        >
            {/* Deep Navy/Blue Base Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#091024] to-[#040B16]" />

            {/* Subtle nebula glows */}
            <div className="absolute inset-0 [background:radial-gradient(60%_40%_at_50%_35%,rgba(34,211,238,0.12),transparent_60%)]" />
            <div className="absolute inset-0 [background:radial-gradient(50%_35%_at_70%_60%,rgba(96,165,250,0.08),transparent_65%)]" />

            {/* Vignette for cinematic framing */}
            <div className="absolute inset-0 [background:radial-gradient(85%_75%_at_50%_55%,transparent_30%,rgba(0,0,0,0.8)_100%)]" />

            {/* High Performance Pure HTML5 Canvas */}
            {mounted && isDark && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 block mix-blend-screen"
                />
            )}
        </div>
    );
}
