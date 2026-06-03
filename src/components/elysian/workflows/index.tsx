import { EyeIcon, Squares2X2Icon, UsersIcon } from "@heroicons/react/24/outline";
import { WorkflowCodeExample } from "./animation-diagram";
import { useTranslation } from "@/hooks/useTranslation";

export function Workflows() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden">
      {/* Header with full-width background */}
      <div className="w-full bg-slate-50 dark:bg-[#101010] relative z-10 landing-xs:py-10 landing-md:py-10 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
            {t.landing.collaboration.badge}
          </p>
          <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 landing-xs:font-normal landing-md:font-normal text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight">
            {t.landing.collaboration.title1} {t.landing.collaboration.title2}
          </h2>
          <p className="max-w-3xl  landing-md:text-xl  landing-xs:text-base text-slate-500 dark:text-[#8a8380] mb-0">
            {t.landing.collaboration.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 landing-xs:mb-16 landing-md:mb-36 mt-12">
        <div className="landing-xs:mb-12 landing-md:mb-16">
          <WorkflowCodeExample isVisible={true} />
        </div>

        {/* Feature Cards - 3 Column Layout to match translations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full mt-8 relative z-10">
          {/* Card 1 - Fact Synchronization */}
          <div className="relative h-full">
            <div className="p-5 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                    <Squares2X2Icon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.collaboration.cards.project.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed">
                  {t.landing.collaboration.cards.project.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Real-time Debate Logs */}
          <div className="relative h-full">
            <div className="p-5 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                    <UsersIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.collaboration.cards.updates.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed">
                  {t.landing.collaboration.cards.updates.desc}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Blockchain Integrity */}
          <div className="relative h-full">
            <div className="p-5 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:border-slate-300 dark:hover:border-[#5c5855] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                    <EyeIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                  </div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">
                    {t.landing.collaboration.cards.workflow.title}
                  </div>
                </div>
                <div className="text-slate-500 dark:text-[#8a8380] text-xs leading-relaxed mb-4">
                  {t.landing.collaboration.cards.workflow.desc}
                </div>
              </div>
              <div className="text-[#38bdf8] text-xs font-semibold cursor-pointer hover:underline flex items-center gap-1">
                {t.landing.collaboration.cards.workflow.cta} &rarr;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
