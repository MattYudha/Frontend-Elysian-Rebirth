import { useTranslation } from "@/hooks/useTranslation";

export const CompaniesMarquee = () => {
  const { t } = useTranslation();
  const marqueeItems = t.landing.marquee;

  const renderRow = (items: string[], reverse = false) => {
    // Duplicate items to ensure smooth infinite loop scroll
    const duplicated = [...items, ...items, ...items, ...items];
    return (
      <div className="relative mb-4 sm:mb-6 overflow-hidden" style={{ perspective: "1000px" }}>
        <div
          className="flex overflow-hidden"
          style={{
            maxWidth: "100%",
            overflowX: "hidden",
            overflowY: "visible",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            isolation: "isolate",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div
            className={`flex py-2 ${
              reverse ? "scroll-right-animation" : "scroll-left-animation"
            }`}
          >
            {duplicated.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                className="flex-shrink-0 flex items-center justify-center px-5 py-2 sm:px-6 sm:py-3 mx-2 sm:mx-3 rounded-full border border-solid border-slate-200 dark:border-[#3d3a39] bg-white/5 dark:bg-[#050507]/40 text-slate-800 dark:text-[#eeeeee] hover:border-slate-300 dark:hover:border-[#5c5855] transition-colors duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-2 inline-block animate-pulse" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-25%, 0, 0);
            -webkit-transform: translate3d(-25%, 0, 0);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translate3d(-25%, 0, 0);
            -webkit-transform: translate3d(-25%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
            -webkit-transform: translate3d(0, 0, 0);
          }
        }

        .scroll-left-animation {
          animation: scrollLeft 35s linear infinite;
          -webkit-animation: scrollLeft 35s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        .scroll-right-animation {
          animation: scrollRight 35s linear infinite;
          -webkit-animation: scrollRight 35s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
      <div className="companies-marquee relative max-w-7xl xs:px-4 lg:px-8 mx-auto landing-xs:my-16 landing-md:my-36">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/60 animate-pulse">
            {t.landing.hero.proof}
          </h2>
        </div>
        {renderRow(marqueeItems, false)}
      </div>
    </>
  );
};
