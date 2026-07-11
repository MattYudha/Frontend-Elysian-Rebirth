import { DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { GitHubStarsProvider } from "@/contexts/GitHubStarsContext";
import React from "react";
import { GitHubLogo } from "@/components/elysian/logos/github";
import { GitHubStargazersAnimation } from "./GitHubStargazersAnimation";
import { useTranslation } from "@/hooks/useTranslation";

interface CommunityLink {
  id: string;
  title: string;
  icon: React.ReactNode;
  url: string;
  tooltip: string;
  showLabel?: boolean;
}

export function CommunitySection() {
  const { t, locale } = useTranslation();

  const COMMUNITY_LINKS: CommunityLink[] = [
    {
      id: "contract",
      title: locale === "id" ? "Smart Contract" : "Smart Contract",
      icon: (
        <ShieldCheckIcon
          className="md:w-20 md:h-20 w-12 h-12 text-[#38bdf8] 
          animate-[colorPulse_6s_ease-in-out_infinite] md:animate-none"
        />
      ),
      url: "https://sepolia.etherscan.io/",
      tooltip: locale === "id" ? "Lacak di Sepolia" : "Track on Sepolia",
    },
    {
      id: "github",
      title: "GitHub",
      icon: (
        <>
          <GitHubLogo
            className="md:w-20
             md:h-20
             w-12 h-12 text-slate-900 dark:text-white md:group-hover:text-[#38bdf8] md:transition-colors md:duration-300
            animate-[colorPulseGithub_6s_ease-in-out_infinite] md:animate-none"
          />
          <GitHubStargazersAnimation />
        </>
      ),
      url: "https://github.com/MattYudha/Backend-Elysian-",
      tooltip: locale === "id" ? "Eksplor Repositori" : "Explore Repository",
    },
    {
      id: "docs",
      title: "Docs",
      icon: (
        <DocumentTextIcon
          className="md:w-20 md:h-20 w-12 h-12 text-sky-400 
          animate-[colorPulseEmerald_6s_ease-in-out_infinite] md:animate-none"
        />
      ),
      url: "/docs",
      tooltip: locale === "id" ? "Baca Dokumentasi" : "Read Architecture",
      showLabel: true,
    },
  ];

  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes colorPulse {
        0%, 100% { color: #38bdf8; }
        50% { color: #10B981; }
      }

      @keyframes colorPulseGithub {
        0%, 100% { color: currentColor; }
        50% { color: #38bdf8; }
      }

      @keyframes colorPulseEmerald {
        0%, 100% { color: #10B981; }
        50% { color: #0369a1; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden z-10">
      <GitHubStarsProvider>
        {/* Header with full-width background */}
        <div className="w-full bg-slate-50 dark:bg-[#101010] landing-xs:py-10 landing-md:py-10 border-y border-slate-100 dark:border-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold  text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
              {locale === "id" ? "Sumber Daya Proyek" : "Project Resources"}
            </p>
            <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 landing-xs:font-normal landing-md:font-normal text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight">
              {locale === "id" ? "Infrastruktur Terbuka & Transparan" : "Open & Transparent Infrastructure"}
            </h2>
            <p className="max-w-3xl  landing-md:text-xl  landing-xs:text-base text-slate-500 dark:text-[#8a8380] mb-0">
              {locale === "id"
                ? "Akses repositori kode, verifikasi transaksi smart contract di blockchain Sepolia, dan pelajari arsitektur sistem kami secara mendalam."
                : "Access our code repository, verify smart contract transactions on Sepolia blockchain explorer, and read our in-depth architecture whitepaper."}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 landing-xs:mb-16 landing-md:mb-12 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 relative z-10 gap-3 md:gap-12 landing-xs:mt-12 landing-md:mt-0">
            {COMMUNITY_LINKS.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group relative landing-xs:p-6 landing-md:p-12 z-10 landing-md:border landing-md:border-solid border-slate-200 dark:border-white/10 no-underline transition-all flex flex-col items-center animate-fade-in landing-xs:unset landing-md:bg-slate-50/50 dark:landing-md:bg-black/20 rounded-lg hover:border-sky-400 hover:bg-slate-100/50 dark:hover:bg-black/40"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex flex-col justify-center items-center transition-transform duration-300 group-hover:scale-110 relative">
                  {link.icon}
                  {link.showLabel && (
                    <span className="absolute top-0 landing-xs:left-8 landing-md:left-14 text-sky-400 text-xs font-medium translate-x-1/2 translate-y-1/2">
                      docs
                    </span>
                  )}
                </div>
                <div className="text-slate-900 dark:text-white mt-4 font-semibold text-base">
                  {link.title}
                </div>
                <div className="md:absolute md:top-2 md:right-7 text-sky-400 px-3 py-1 rounded md:opacity-0 opacity-100 md:group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium whitespace-nowrap pointer-events-none md:translate-x-1/4 md:-translate-y-1/4 mt-2 md:mt-0">
                  {link.tooltip}
                </div>
              </a>
            ))}
          </div>
        </div>
      </GitHubStarsProvider>
    </section>
  );
}
