import {
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  ServerStackIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useMediaQuery } from "@/hooks/use-media-query";
import { RagExample } from "./rag-animation";
import { RagMobile } from "./rag-mobile";
import { useTranslation } from "@/hooks/useTranslation";

export function Rag() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="relative w-full overflow-hidden">
      {/* Header with full-width background */}
      <div className="w-full bg-slate-50 dark:bg-[#101010] relative z-10 landing-xs:py-10 landing-md:py-10 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
            {t.landing.deepDive.badge}
          </p>
          <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 landing-xs:font-normal landing-md:font-normal text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight">
            {t.landing.deepDive.title1} {t.landing.deepDive.title2}
          </h2>
          <p className="max-w-3xl  landing-md:text-xl  landing-xs:text-base text-slate-500 dark:text-[#8a8380] mb-0">
            {t.landing.deepDive.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 sm:px-6 lg:px-8 landing-xs:mb-16 landing-md:mb-36 mt-12">
        {/* Code Example - Full Width */}
        <div className="">
          {isMobile ? <RagMobile isVisible={true} /> : <RagExample isVisible={true} />}
        </div>
        {/* Feature Cards - Grid Layout */}
        <div className="grid  landing-xs:grid-cols-1 landing-md:grid-cols-4 gap-4 h-full ">
          {/* Feature 1 - MiroFish Engine */}
          <div className="relative h-full cursor-pointer">
            <div className="p-4 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex  items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex  w-10 h-10 rounded-md items-center justify-center shrink-0">
                    <ServerStackIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.features.items.ai.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed">
                  {t.landing.features.items.ai.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - OpenViking RAG */}
          <div className="relative h-full cursor-pointer ">
            <div className="p-4 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex  items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex  w-10 h-10 rounded-md items-center justify-center shrink-0">
                    <FunnelIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.features.items.docs.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed">
                  {t.landing.features.items.docs.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Trust Layer */}
          <div className="relative h-full cursor-pointer">
            <div className="p-4 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex  items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex  w-10 h-10 rounded-md items-center justify-center shrink-0">
                    <SparklesIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.features.items.security.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed">
                  {t.landing.features.items.security.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 - Caveman Prompt */}
          <div className="relative h-full cursor-pointer">
            <div className="p-4 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex  items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 landing-xs:hidden landing-md:flex  w-10 h-10 rounded-md items-center justify-center shrink-0">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="landing-xs:text-sm landing-lg:text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.features.items.automation.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed">
                  {t.landing.features.items.automation.desc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
