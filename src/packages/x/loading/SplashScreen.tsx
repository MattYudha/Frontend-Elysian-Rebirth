'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Typography } from 'antd';

const { Title, Text } = Typography;

export interface SplashScreenProps {
    /**
     * Main title text
     */
    title?: string;

    /**
     * Subtitle or loading message
     */
    subtitle?: string;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * SplashScreen - Full-screen initial loading animation
 * 
 * Dark-themed loading screen with gradients, glows, and animated elements.
 * 
 * @example
 * ```tsx
 * <SplashScreen
 *   title="Enterprise AI Control Center"
 *   subtitle="Preparing your workspace..."
 * />
 * ```
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({
    title = 'Enterprise AI Platform',
    subtitle = 'Loading...',
    className,
}) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={className}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            {/* Animated background glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(22, 119, 255, 0.3) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'pulse 3s ease-in-out infinite',
                }}
            />

            {/* Logo/Icon placeholder */}
            <div
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 32,
                    boxShadow: '0 0 40px rgba(22, 119, 255, 0.6)',
                    animation: 'rotate 4s linear infinite',
                }}
            >
                <div
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                    }}
                />
            </div>

            {/* Title */}
            <Title level={1} style={{ color: '#ffffff', marginBottom: 16, textAlign: 'center' }}>
                {title}
            </Title>

            {/* Subtitle with animated dots */}
            <Text style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 32 }}>
                {subtitle}{dots}
            </Text>

            {/* Loading spinner */}
            <Spin size="large" />

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.4)',
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                        animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}

            <style>
                {`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-20px); opacity: 1; }
          }
        `}
            </style>
        </div>
    );
};

SplashScreen.displayName = 'SplashScreen';
