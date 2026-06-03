'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { LandingNavbar } from '@/components/LandingNavbar';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Button } from '@/components/elysian/elysianops/Button';

// Reusable components
const Section = ({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) => (
  <section className={`relative py-8 md:py-10 lg:py-16 ${className}`}>{children}</section>
);

const Container = ({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const features = [
  {
    title: "Visual Agent Execution",
    description:
      "Visualize your agent's execution as an interactive flow diagram. Instantly spot bottlenecks, failed steps, and unexpected behaviors.",
    image: "https://cdn.voltagent.dev/website/observability/framework.png",
  },
  {
    title: "Alerts & Notifications",
    description:
      "Get notified when things break. Set up alerts for latency, errors, and token usage. Receive notifications via Slack, email, or webhooks.",
    image: "https://cdn.voltagent.dev/website/observability/alerts.png",
  },
  {
    title: "Detailed Tracing & Logs",
    description:
      "Trace every LLM call, tool execution, and agent interaction. Replay sessions, inspect payloads, and find the root cause fast.",
    image: "https://cdn.voltagent.dev/website/observability/logs.png",
  },
];

export default function Usecases() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden w-full transition-colors duration-[600ms] ease-in-out ${
      isDark ? 'bg-[#050507] text-slate-100' : 'bg-white text-slate-900'
    }`}>
      <LandingNavbar />

      <main className="flex-1 relative overflow-hidden pt-28">
        
        {/* Global Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/3 via-transparent to-blue-500/3" />
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] left-[25%] w-[450px] h-[450px] bg-sky-400/4 rounded-full blur-[110px]" />
        </div>

        <DotPattern 
          dotColor={isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(148, 163, 184, 0.12)"} 
          dotSize={1.2} 
          spacing={20} 
          className="opacity-[0.25]"
        />

        {/* Hero Section */}
        <Section className="relative pt-12 md:pt-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left side - Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-sky-400 border border-solid border-sky-500/20 bg-sky-500/10">
                    <ChartBarIcon className="w-4 h-4 mr-2" />
                    ElysianOps Observability
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-[-0.025em] font-normal text-white mb-4 sm:mb-6 leading-tight">
                  Real-time <span className="text-sky-400">LLM Observability</span> for AI Agents
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 leading-relaxed">
                  Catch AI agent failures before they reach production. Get full visibility into
                  every step, from input to output.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    href="https://console.voltagent.dev/demo"
                    variant="primary"
                    target="_blank"
                  >
                    Try Live Demo
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                  <Button href="/documentations/" variant="secondary">
                    View Documentation
                  </Button>
                </div>
              </motion.div>

              {/* Right side - Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://cdn.voltagent.dev/website/observability/dashboard.png"
                  alt="ElysianOps Observability Dashboard"
                  className="w-full h-auto rounded-xl object-cover border border-solid border-zinc-800"
                />
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Features Section */}
        <Section className="relative">
          <Container className="relative z-10">
            <div className="space-y-16 lg:space-y-20">
              {features.map((feature, index) => (
                <motion.div
                  key={`${feature.title}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + index * 0.1,
                    type: "spring",
                    stiffness: 80,
                  }}
                  className="group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Feature Image */}
                    <div className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto rounded-xl object-cover border border-solid border-zinc-800"
                      />
                    </div>
                    {/* Feature Content */}
                    <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="flex items-center gap-4 mb-5">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-white leading-tight mb-0">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-0">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {/* Divider between features */}
                  {index < features.length - 1 && (
                    <div className="mt-16 lg:mt-20 border-t border-solid border-gray-800/50" />
                  )}
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}
