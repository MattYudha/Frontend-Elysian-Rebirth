import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { BoltIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { TypeScriptLogo } from "@/components/elysian/logos/integrations/typescript";
import { AgentsAnimation } from "../agents-animation";
import { FeatureShowcase } from "../feature-showcase";
import { LineShadowText } from "../magicui/line-shadow-text";
import { useTranslation } from "@/hooks/useTranslation";

export function Hero() {
  const { t, locale } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [commandText, setCommandText] = useState("elysian audit --draft ./rapbd-25.pdf");
  const [isTyping, setIsTyping] = useState(false);
  const originalCommand = "elysian audit --draft ./rapbd-25.pdf";
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const thinkingMessages = ["Memory", "RAG", "Tool", "MCP", "Agent", "Supervisor"];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCommandClick = async () => {
    if (isTyping) return;

    setIsTyping(true);

    // Copy to clipboard
    await navigator.clipboard.writeText(originalCommand);

    // Clear the text character by character
    for (let i = commandText.length; i >= 0; i--) {
      await new Promise<void>((resolve) => {
        typingTimerRef.current = setTimeout(() => {
          setCommandText(originalCommand.substring(0, i));
          resolve();
        }, 20);
      });
    }

    // Show AI thinking messages in sequence
    for (let msgIndex = 0; msgIndex < thinkingMessages.length; msgIndex++) {
      setCommandText(thinkingMessages[msgIndex]);

      // Wait between each thinking message
      await new Promise((resolve) => {
        typingTimerRef.current = setTimeout(resolve, 500);
      });
    }

    // Type "Copied!" with a slight delay between characters
    const copiedText = "Copied to clipboard!";
    for (let i = 0; i <= copiedText.length; i++) {
      await new Promise<void>((resolve) => {
        typingTimerRef.current = setTimeout(() => {
          setCommandText(copiedText.substring(0, i));
          resolve();
        }, 40);
      });
    }

    // Add pulse effect class
    const commandElement = document.querySelector(".command-text");
    if (commandElement) {
      commandElement.classList.add("pulse-effect");
    }

    // Wait for 1.5 seconds
    await new Promise((resolve) => {
      typingTimerRef.current = setTimeout(resolve, 1500);
    });

    // Remove pulse effect
    if (commandElement) {
      commandElement.classList.remove("pulse-effect");
    }

    // Clear "Copied!" character by character
    for (let i = copiedText.length; i >= 0; i--) {
      await new Promise<void>((resolve) => {
        typingTimerRef.current = setTimeout(() => {
          setCommandText(copiedText.substring(0, i));
          resolve();
        }, 20);
      });
    }

    // Type the original command again
    for (let i = 0; i <= originalCommand.length; i++) {
      await new Promise<void>((resolve) => {
        typingTimerRef.current = setTimeout(() => {
          setCommandText(originalCommand.substring(0, i));
          resolve();
        }, 30);
      });
    }

    setIsTyping(false);
  };

  // Clean up any pending timers when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="relative max-w-7xl xs:px-4 lg:px-8 mx-auto landing-xs:mb-16 landing-md:mb-20">
        <div className="mt-16 md:mt-24" />
        <div className="grid xs:grid-cols-1 mx-4 lg:mx-0 lg:grid-cols-2 gap-8 items-center">
          <div>
            {/* Main Heading */}
            <h2
              className={`text-left mb-2 font-bold transition-all duration-1000 tracking-[-0.025em] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span
                className="inline-block relative text-sm sm:text-base font-semibold text-[#38bdf8] uppercase tracking-wider flex items-center gap-2 cursor-default"
                onMouseEnter={() => setShowHeart(true)}
                onMouseLeave={() => setShowHeart(false)}
              >
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block animate-pulse" />
                {t.landing.hero.badge}
                {showHeart && (
                  <span className="absolute -right-8 top-1 animate-[zap_1.5s_ease-in-out_infinite]">
                    <BoltIcon className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  </span>
                )}
              </span>
            </h2>

            <h1
              className={`text-4xl sm:text-5xl text-slate-900 dark:text-neutral-100 md:text-5xl lg:text-6xl font-normal tracking-[-0.65px] text-left mb-6 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t.landing.hero.title1}{" "}
              <span className="inline-flex flex-wrap gap-x-2 landing-md:mt-4 landing-xs:mt-2 ml-2 landing-sm:ml-0">
                {t.landing.hero.title2.split(" ").map((word, idx) => (
                  <LineShadowText
                    key={idx}
                    className="text-[#38bdf8] italic whitespace-nowrap"
                    shadowColor={"#38bdf8"}
                  >
                    {word}
                  </LineShadowText>
                ))}
              </span>
            </h1>

            <div
              className={`text-base sm:text-lg md:text-xl text-slate-500 dark:text-gray-400 text-left mb-12 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-slate-800 dark:text-white text-base sm:text-lg md:text-xl">
                {t.landing.hero.description}
              </span>
            </div>

            <div
              className={`flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 mb-12 transition-all duration-1000 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                href="/docs/"
                className="w-full sm:w-auto px-4 py-3 font-bold landing-sm:text-lg landing-xs:text-base font-mono border border-solid border-[#3d3a39] backdrop-blur-sm cursor-pointer bg-transparent text-slate-800 dark:text-[#eeeeee] rounded-md transition duration-300 flex items-center outline-none justify-center sm:justify-start gap-2 hover:bg-transparent hover:border-[#5c5855] hover:text-[#f3f4f6] no-underline"
              >
                <ChevronRightIcon className="landing-xs:w-4 landing-xs:h-4 landing-md:w-6 landing-md:h-6" />
                {t.landing.hero.ctaStart}
              </Link>

              <button
                type="button"
                onClick={handleCommandClick}
                aria-label="Copy npm command to clipboard"
                className="w-full sm:w-auto flex cursor-pointer items-center justify-center border backdrop-blur-sm h-[53px] border-solid border-slate-200 dark:border-[#3d3a39] rounded-md px-4 py-3 font-[monospace] text-[13px] hover:bg-slate-50 dark:hover:bg-[#101010] transition duration-300 bg-transparent"
              >
                <span className="mr-2 text-[#38bdf8]">$</span>
                <span className="command-text text-slate-800 dark:text-slate-800 dark:text-[#eeeeee] min-w-[220px] text-left relative">
                  {commandText}
                  {isTyping && !thinkingMessages.includes(commandText) && commandText !== "" && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className="landing-xs:pl-0 landing-md:pl-12 h-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
            <AgentsAnimation />
          </div>
        </div>
      </div>

      {/* Platform Container - Full Width */}
      <div className="w-full bg-slate-50 dark:bg-[#101010] mt-16 md:mt-36 py-10 md:py-12 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 landing-md:px-0">
          <h2 className="landing-xs:text-sm landing-md:text-xl landing-xs:mb-2 landing-md:mb-12 font-semibold text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block animate-pulse" />
            {locale === "id" ? "Platform Otonom" : "Autonomous Platform"}
          </h2>

          {/* Two boxes with connector */}
          <div className="grid grid-cols-1 relative z-10  md:grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 items-stretch mt-6">
            {/* Core Framework Box */}
            <div className="flex flex-col gap-3 p-4 md:p-6 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#050507] transition-colors hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a]">
              <div className="flex flex-row items-center gap-2 sm:gap-3">
                <TypeScriptLogo className="w-5 h-5 md:w-6 md:h-6 rounded" />
                <span className="text-slate-900 dark:text-white font-semibold text-lg md:text-xl">
                  {locale === "id" ? "MiroFish Swarm Engine" : "MiroFish Swarm Engine"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-solid border-slate-200 dark:border-[#3d3a39] text-slate-500 dark:text-[#8a8380] w-fit">
                  {locale === "id" ? "Kecerdasan Swarm" : "Swarm Intelligence"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm text-[#38bdf8]">
                <span>{locale === "id" ? "Multi-Agent Swarm" : "Multi-Agent Swarm"}</span>
                <span className="text-slate-300 dark:text-white/20">|</span>
                <span>{locale === "id" ? "Konsensus Otonom" : "Autonomous Consensus"}</span>
                <span className="text-slate-300 dark:text-white/20">|</span>
                <span>MiroFish</span>
              </div>
              <span className="text-slate-800 dark:text-[#eeeeee] text-sm md:text-base">
                {locale === "id"
                  ? "Membangun kolaborasi agen AI dengan konsensus perdebatan otonom."
                  : "Build AI agent collaboration with autonomous debating consensus."}
              </span>
            </div>

            <div className="flex items-center justify-center py-1 md:py-0">
              <span className="text-slate-400 dark:text-white/30 text-lg md:text-2xl font-light">+</span>
            </div>

            {/* ElysianOps Console Box */}
            <div className="flex flex-col gap-3 p-4 md:p-6 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#050507] transition-colors hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a]">
              <div className="flex flex-row items-center gap-2 sm:gap-3">
                <span className="text-slate-900 dark:text-white font-semibold text-lg md:text-xl">
                  {locale === "id" ? "Elysian Trust & RAG" : "Elysian Trust & RAG"}
                </span>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-solid border-slate-200 dark:border-[#3d3a39] text-slate-500 dark:text-[#8a8380]">
                    On-Chain
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-solid border-slate-200 dark:border-[#3d3a39] text-slate-500 dark:text-[#8a8380]">
                    Self-Hosted
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm text-[#38bdf8]">
                <span>OpenViking RAG</span>
                <span className="text-slate-300 dark:text-white/20">|</span>
                <span>Nemesis DB</span>
                <span className="text-slate-300 dark:text-white/20">|</span>
                <span>Sepolia Testnet</span>
                <span className="text-slate-300 dark:text-white/20">|</span>
                <span>QA Gate</span>
              </div>
              <span className="text-slate-800 dark:text-[#eeeeee] text-sm md:text-base">
                {locale === "id"
                  ? "Ekstraksi dokumen regulasi dengan RAG dan pencatatan audit trail di blockchain secara aman."
                  : "Extract regulatory documents with RAG and record audit trails securely on the blockchain."}
              </span>
            </div>
          </div>
        </div>

        {/* FeatureShowcase inside platform bg */}
        <div className="mt-10 md:mt-12">
          <FeatureShowcase />
        </div>
      </div>
    </>
  );
}
