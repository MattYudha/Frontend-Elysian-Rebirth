import { useMediaQuery } from "@/hooks/use-media-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  SlackLogo,
  FigmaLogo,
  GitHubLogo,
  GoogleDriveLogo,
  NotionLogo,
  SupabaseLogo,
  GmailLogo,
} from "@/components/elysian/logos";
import { useTranslation } from "@/hooks/useTranslation";

// Add keyframes for the filling animation
const fillAnimation = `
  @keyframes fillBolt {
    0% {
      clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
    }
    45% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
    50% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
    100% {
      clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
    }
  }

  @keyframes glowEffect {
    0% {
      filter: drop-shadow(0 0 2px #38bdf8);
    }
    50% {
      filter: drop-shadow(0 0 8px #38bdf8);
    }
    100% {
      filter: drop-shadow(0 0 2px #38bdf8);
    }
  }

  @keyframes particleRotate1 {
    0%, 45% {
      transform: rotate(0deg) translate(0, 0) scale(0);
      opacity: 0;
    }
    50% {
      transform: rotate(0deg) translate(30px, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: rotate(360deg) translate(30px, 0) scale(0);
      opacity: 0;
    }
  }

  @keyframes particleRotate2 {
    0%, 45% {
      transform: rotate(120deg) translate(0, 0) scale(0);
      opacity: 0;
    }
    50% {
      transform: rotate(120deg) translate(30px, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: rotate(480deg) translate(30px, 0) scale(0);
      opacity: 0;
    }
  }

  @keyframes particleRotate3 {
    0%, 45% {
      transform: rotate(240deg) translate(0, 0) scale(0);
      opacity: 0;
    }
    50% {
      transform: rotate(240deg) translate(30px, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: rotate(600deg) translate(30px, 0) scale(0);
      opacity: 0;
    }
  }

  @keyframes scrollLeft {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.33%);
    }
  }

  @keyframes scrollRight {
    0% {
      transform: translateX(-33.33%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .scroll-left-animation {
    animation: scrollLeft 25s linear infinite;
  }

  .scroll-right-animation {
    animation: scrollRight 25s linear infinite;
  }

  .animation-paused {
    animation-play-state: paused;
  }
`;

const CustomBolt = ({ width = 150, height = 150, isDark = true }: { width?: number; height?: number; isDark?: boolean }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: "glowEffect 1.5s ease-in-out infinite",
      }}
      aria-labelledby="boltLogoTitle"
    >
      <title id="boltLogoTitle">Lightning Bolt</title>
      {/* Background bolt path */}
      <path d="M45 15L20 40H35L30 65L55 40H40L45 15Z" fill={isDark ? "rgba(56,189,248,0.1)" : "rgba(56,189,248,0.05)"} />
      {/* Animated filling bolt path */}
      <path
        d="M45 15L20 40H35L30 65L55 40H40L45 15Z"
        fill="#38bdf8"
        style={{
          animation: "fillBolt 3s ease-in-out infinite",
        }}
      />
      {/* Rotating particles */}
      <g
        style={{
          transformOrigin: "center",
          animation: "particleRotate1 3s ease-out infinite",
        }}
      >
        <circle cx="40" cy="40" r="2" fill="#38bdf8" />
        <circle cx="40" cy="40" r="1" fill="#fff" />
      </g>
      <g
        style={{
          transformOrigin: "center",
          animation: "particleRotate2 3s ease-out infinite",
        }}
      >
        <circle cx="40" cy="40" r="2" fill="#38bdf8" />
        <circle cx="40" cy="40" r="1" fill="#fff" />
      </g>
      <g
        style={{
          transformOrigin: "center",
          animation: "particleRotate3 3s ease-out infinite",
        }}
      >
        <circle cx="40" cy="40" r="2" fill="#38bdf8" />
        <circle cx="40" cy="40" r="1" fill="#fff" />
      </g>
    </svg>
  );
};

interface IntegrationsProps {
  isDark?: boolean;
}

export function Integrations({ isDark: isDarkProp }: IntegrationsProps) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [isTopRowPaused, setIsTopRowPaused] = useState(false);
  const [isBottomRowPaused, setIsBottomRowPaused] = useState(false);

  // Map logos to the translation keys under t.landing.integration.items
  const topRowLogos = [
    {
      logo: <SlackLogo key="slack" className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.landing.integration.items.slack.title,
      desc: t.landing.integration.items.slack.desc,
    },
    {
      logo: <FigmaLogo key="figma" className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.landing.integration.items.figma.title,
      desc: t.landing.integration.items.figma.desc,
    },
    {
      logo: <GitHubLogo key="github" className="w-6 h-6 text-slate-800 dark:text-white sm:w-8 sm:h-8" />,
      title: t.landing.integration.items.github.title,
      desc: t.landing.integration.items.github.desc,
    },
    {
      logo: <GoogleDriveLogo key="drive" className="w-6 h-6 sm:w-10 sm:h-10" />,
      title: t.landing.integration.items.drive.title,
      desc: t.landing.integration.items.drive.desc,
    },
  ];

  const bottomRowLogos = [
    {
      logo: <NotionLogo key="notion" className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.landing.integration.items.notion.title,
      desc: t.landing.integration.items.notion.desc,
    },
    {
      logo: <SupabaseLogo key="supabase" className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.landing.integration.items.postgres.title,
      desc: t.landing.integration.items.postgres.desc,
    },
    {
      logo: <GmailLogo key="gmail" className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: t.landing.integration.items.gmail.title,
      desc: t.landing.integration.items.gmail.desc,
    },
  ];

  // Duplicate logos for continuous scrolling effect
  const duplicatedTopLogos = [...topRowLogos, ...topRowLogos, ...topRowLogos];
  const duplicatedBottomLogos = [...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos];

  // Handle pause/resume for hover and touch for each row independently
  const handleTopRowTouchStart = useCallback(() => setIsTopRowPaused(true), []);
  const handleTopRowTouchEnd = useCallback(() => setIsTopRowPaused(false), []);
  const handleTopRowMouseEnter = useCallback(() => setIsTopRowPaused(true), []);
  const handleTopRowMouseLeave = useCallback(() => setIsTopRowPaused(false), []);

  const handleBottomRowTouchStart = useCallback(() => setIsBottomRowPaused(true), []);
  const handleBottomRowTouchEnd = useCallback(() => setIsBottomRowPaused(false), []);
  const handleBottomRowMouseEnter = useCallback(() => setIsBottomRowPaused(true), []);
  const handleBottomRowMouseLeave = useCallback(() => setIsBottomRowPaused(false), []);

  useEffect(() => {
    // Add touch event listeners for mobile - top row
    const topElement = topRowRef.current;
    if (topElement) {
      topElement.addEventListener("touchstart", handleTopRowTouchStart, {
        passive: true,
      });
      topElement.addEventListener("touchend", handleTopRowTouchEnd, {
        passive: true,
      });
    }

    // Add touch event listeners for mobile - bottom row
    const bottomElement = bottomRowRef.current;
    if (bottomElement) {
      bottomElement.addEventListener("touchstart", handleBottomRowTouchStart, {
        passive: true,
      });
      bottomElement.addEventListener("touchend", handleBottomRowTouchEnd, {
        passive: true,
      });
    }

    return () => {
      // Clean up top row listeners
      if (topElement) {
        topElement.removeEventListener("touchstart", handleTopRowTouchStart);
        topElement.removeEventListener("touchend", handleTopRowTouchEnd);
      }

      // Clean up bottom row listeners
      if (bottomElement) {
        bottomElement.removeEventListener("touchstart", handleBottomRowTouchStart);
        bottomElement.removeEventListener("touchend", handleBottomRowTouchEnd);
      }
    };
  }, [
    handleTopRowTouchStart,
    handleTopRowTouchEnd,
    handleBottomRowTouchStart,
    handleBottomRowTouchEnd,
  ]);

  const { resolvedTheme } = useTheme();
  const isDark = isDarkProp !== undefined ? isDarkProp : resolvedTheme === "dark";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Header with full-width background */}
      <div className="w-full bg-slate-50 dark:bg-[#050507] relative z-10 landing-xs:py-10 landing-md:py-10 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-5xl">
            <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
              {t.landing.integration.badge}
            </p>
            <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 landing-xs:font-normal landing-md:font-normal text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight">
              {t.landing.integration.title1} {t.landing.integration.title2}
            </h2>
            <p className="max-w-3xl  landing-md:text-xl  landing-xs:text-base text-slate-500 dark:text-[#8a8380] mb-0">
              {t.landing.integration.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 sm:px-6 lg:px-8 landing-xs:mb-16 landing-md:mb-36 mt-12">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
            <div className="w-full flex md:w-[40%] justify-center items-center landing-xs:hidden landing-sm:flex">
              <style>{fillAnimation}</style>
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg flex items-center justify-center">
                <CustomBolt width={isDesktop ? 200 : 150} height={isDesktop ? 200 : 150} isDark={isDark} />
              </div>
            </div>

            {/* Right side with sliding logos */}
            <div className="w-full md:w-[60%]">
              {/* Top row - scrolling left */}
              <div className="relative mb-4 sm:mb-6">
                <div
                  ref={topRowRef}
                  className="flex overflow-hidden"
                  style={{
                    maxWidth: "100%",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                    WebkitMaskImage:
                      "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
                  }}
                >
                  <div
                    className={`flex space-x-4 sm:space-x-6 py-2 scroll-left-animation ${
                      isTopRowPaused ? "animation-paused" : ""
                    }`}
                  >
                    {duplicatedTopLogos.map((item, index) => (
                      <div
                        key={`top-logo-${item.title}-${index}`}
                        className="group relative flex-shrink-0 bg-slate-50 dark:bg-[#101010] w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg cursor-pointer border-solid border-slate-200 dark:border-[#3d3a39] hover:border-slate-300 dark:border-[#5c5855] hover:bg-white dark:bg-[#1a1a1a] transition-all duration-200"
                        onMouseEnter={handleTopRowMouseEnter}
                        onMouseLeave={handleTopRowMouseLeave}
                        onTouchStart={handleTopRowTouchStart}
                        onTouchEnd={handleTopRowTouchEnd}
                      >
                        {item.logo}
                        <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 -top-24 transform -translate-x-1/2 left-1/2 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs sm:text-sm px-3 py-2 rounded-md whitespace-nowrap z-20 shadow-lg border border-solid border-slate-200 dark:border-[#3d3a39] max-w-[250px]">
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-[#8a8380] whitespace-normal mt-0.5 leading-tight">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row - scrolling right */}
              <div className="relative">
                <div
                  ref={bottomRowRef}
                  className="flex overflow-hidden"
                  style={{
                    maxWidth: "100%",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch",
                    WebkitMaskImage:
                      "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
                    maskImage:
                      "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
                  }}
                >
                  <div
                    className={`flex space-x-4 sm:space-x-6 py-2 scroll-right-animation ${
                      isBottomRowPaused ? "animation-paused" : ""
                    }`}
                  >
                    {duplicatedBottomLogos.map((item, index) => (
                      <div
                        key={`bottom-logo-${item.title}-${index}`}
                        className="group relative flex-shrink-0 bg-slate-50 dark:bg-[#101010] w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg cursor-pointer border-solid border-slate-200 dark:border-[#3d3a39] hover:border-slate-300 dark:border-[#5c5855] hover:bg-white dark:bg-[#1a1a1a] transition-all duration-200"
                        onMouseEnter={handleBottomRowMouseEnter}
                        onMouseLeave={handleBottomRowMouseLeave}
                        onTouchStart={handleBottomRowTouchStart}
                        onTouchEnd={handleBottomRowTouchEnd}
                      >
                        {item.logo}
                        <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 -top-24 transform -translate-x-1/2 left-1/2 bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white text-xs sm:text-sm px-3 py-2 rounded-md whitespace-nowrap z-20 shadow-lg border border-solid border-slate-200 dark:border-[#3d3a39] max-w-[250px]">
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-[#8a8380] whitespace-normal mt-0.5 leading-tight">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
