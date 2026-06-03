import {
  CircleStackIcon,
  CommandLineIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { CodeExample } from "./code-example";
import { useTranslation } from "@/hooks/useTranslation";

export function AgentsDetail() {
  const { t } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState<"dev" | "docs" | "insights">(
    "dev",
  );

  // Handler for feature card clicks
  const handleFeatureClick = (featureType: "dev" | "docs" | "insights") => {
    setSelectedFeature(featureType);
  };

  return (
    <div className="text-slate-900 dark:text-white relative w-full overflow-hidden landing-md:mt-12 mb-24">
      {/* Header with full-width background */}
      <div className="w-full bg-slate-50 dark:bg-[#101010] relative z-10 landing-xs:py-16 landing-md:py-12 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto   px-4">
          <div className="text-left max-w-4xl ">
            <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold  text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
              {t.landing.showcase.badge}
            </p>
            <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 landing-xs:font-normal landing-md:font-normal text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight">
              {t.landing.showcase.title1} {t.landing.showcase.title2}
            </h2>
            <p className="max-w-3xl  landing-md:text-xl  landing-xs:text-base text-slate-500 dark:text-[#8a8380] mb-0">
              {t.landing.showcase.description}
            </p>
          </div>
        </div>
      </div>

      {/* Two column layout for code and features */}
      <div className="max-w-7xl relative z-10  mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Code Example - Left column */}
          <div className="lg:w-1/2 h-full order-2 lg:order-2">
            <CodeExample featureType={selectedFeature} />
          </div>

          {/* Features Section - Right column */}
          <div className="lg:w-1/2 order-1 lg:order-1">
            <div className="grid grid-cols-1 gap-4 h-full">
              {/* Feature 1 - Swarm Engine */}
              <div className="relative">
                <div
                  style={{ borderWidth: "1px" }}
                  className={`landing-xs:p-3 rounded-lg border border-solid ${
                    selectedFeature === "dev"
                      ? "border-slate-300 dark:border-[#5c5855] bg-slate-100/80 dark:bg-[#1a1a1a]"
                      : "border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a]"
                  } transition-colors duration-300 cursor-pointer`}
                  onClick={() => handleFeatureClick("dev")}
                >
                  <div className="flex landing-xs:flex-row landing-md:flex-col landing-xs:items-center landing-md:items-start gap-2 mb-2">
                    <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex landing-md:w-8 landing-lg:w-10 landing-md:h-8 landing-lg:h-10 rounded-md items-center justify-center">
                      <WrenchIcon className="landing-md:w-4 landing-lg:w-5 landing-md:h-4 landing-lg:h-5 text-slate-600 dark:text-[#b8b3b0]" />
                    </div>
                    <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                      {t.landing.showcase.cards.dev.title}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed landing-xs:mb-0 landing-md:mb-4">
                    {t.landing.showcase.cards.dev.desc}
                  </p>
                </div>
              </div>

              {/* Feature 2 - Ground Truth & RAG */}
              <div className="relative">
                <div
                  style={{ borderWidth: "1px" }}
                  className={`landing-xs:p-3 rounded-lg border border-solid ${
                    selectedFeature === "docs"
                      ? "border-slate-300 dark:border-[#5c5855] bg-slate-100/80 dark:bg-[#1a1a1a]"
                      : "border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a]"
                  } transition-colors duration-300 cursor-pointer`}
                  onClick={() => handleFeatureClick("docs")}
                >
                  <div className="flex landing-xs:flex-row landing-md:flex-col landing-xs:items-center landing-md:items-start gap-2 mb-2">
                    <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex landing-md:w-8 landing-lg:w-10 landing-md:h-8 landing-lg:h-10 rounded-md items-center justify-center">
                      <CircleStackIcon className="landing-md:w-4 landing-lg:w-5 landing-md:h-4 landing-lg:h-5 text-slate-600 dark:text-[#b8b3b0]" />
                    </div>
                    <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                      {t.landing.showcase.cards.docs.title}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed landing-xs:mb-0 landing-md:mb-4">
                    {t.landing.showcase.cards.docs.desc}
                  </p>
                </div>
              </div>

              {/* Feature 3 - Immutable Trust Layer */}
              <div className="relative">
                <div
                  style={{ borderWidth: "1px" }}
                  className={`landing-xs:p-3 rounded-lg border border-solid ${
                    selectedFeature === "insights"
                      ? "border-slate-300 dark:border-[#5c5855] bg-slate-100/80 dark:bg-[#1a1a1a]"
                      : "border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a]"
                  } transition-colors duration-300 cursor-pointer`}
                  onClick={() => handleFeatureClick("insights")}
                >
                  <div className="flex landing-xs:flex-row landing-md:flex-col landing-xs:items-center landing-md:items-start gap-2 mb-2">
                    <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex landing-md:w-8 landing-lg:w-10 landing-md:h-8 landing-lg:h-10 rounded-md items-center justify-center">
                      <CommandLineIcon className="landing-md:w-4 landing-lg:w-5 landing-md:h-4 landing-lg:h-5 text-slate-600 dark:text-[#b8b3b0]" />
                    </div>
                    <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                      {t.landing.showcase.cards.insights.title}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed landing-xs:mb-0 landing-md:mb-4">
                    {t.landing.showcase.cards.insights.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
