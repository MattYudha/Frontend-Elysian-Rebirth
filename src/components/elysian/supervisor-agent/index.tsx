import { CpuChipIcon, EyeIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { MobileCodeBlock } from "./mobile-code-block";
import { MobileVersion } from "./mobile-version";
import { WorkflowCodeExample } from "./workflow-code-example";
import { useTranslation } from "@/hooks/useTranslation";

interface SupervisorAgentProps {
  isDark?: boolean;
}

export function SupervisorAgent({ isDark }: SupervisorAgentProps) {
  const { t, locale } = useTranslation();
  const [highlightedSection, setHighlightedSection] = useState<string | null>("analyst");

  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Function to define code sections
  const getHighlightClasses = (section: string) => {
    const baseHighlightClass = "transition-all duration-300 ease-in-out";

    return highlightedSection === section
      ? `bg-gradient-to-r from-[#1a1a1a]/70 to-[#151515]/70 border-l-2 border-solid border-t-0 border-r-0 border-b-0 border-[#38bdf8] pl-2 rounded-sm shadow-lg text-white ${baseHighlightClass}`
      : `text-[#8b949e] ${baseHighlightClass}`;
  };

  // Handlers for mouse over and click
  const handleMouseEnter = (section: string) => {
    setHighlightedSection(section);
  };

  const handleMouseLeave = () => {
    setHighlightedSection(null);
  };

  const handleClick = (section: string) => {
    setHighlightedSection(section === highlightedSection ? null : section);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Header with full-width background */}
      <div className="w-full bg-slate-50 dark:bg-[#101010] relative z-10 landing-xs:py-10 landing-md:py-10 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
            {t.landing.agents.badge}
          </p>
          <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 landing-xs:font-normal landing-md:font-normal text-slate-900 dark:text-white sm:text-5xl sm:tracking-tight">
            {t.landing.agents.title1} {t.landing.agents.title2}
          </h2>
          <p className="max-w-3xl  landing-md:text-xl  landing-xs:text-base text-slate-500 dark:text-[#8a8380] mb-0">
            {t.landing.agents.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl relative z-10 mx-auto px-4 sm:px-6 lg:px-8 landing-xs:mb-16 landing-md:mb-36 mt-12">
        {/* Code Example - Full Width */}
        <div className="">
          {isMobile ? <MobileVersion isVisible={true} /> : <WorkflowCodeExample isVisible={true} isDark={isDark} />}
        </div>

        {/* Code block section */}
        <div className="flex items-center justify-center landing-xs:mt-0 landing-md:mt-12">
          {isMobile ? (
            <MobileCodeBlock isVisible={true} />
          ) : (
            <>
              {/* Code Section - Full Width */}
              <div className="w-[55%] border-t border-r-0 rounded-none border-b-0 rounded-lg border-t-0 border-solid border-white/10">
                <pre className="text-left h-full bg-[#020202] p-0 text-xs md:text-sm font-mono m-0">
                  <div className="flex">
                    <div className="py-5 px-2 text-right text-[#8b949e] select-none border-r border-[#3d3a39] min-w-[40px] text-xs">
                      <div>1</div>
                      <div>2</div>
                      <div>3</div>
                      <div>4</div>
                      <div>5</div>
                      <div>6</div>
                      <div>7</div>
                      <div>8</div>
                      <div>9</div>
                      <div>10</div>
                      <div>11</div>
                      <div>12</div>
                      <div>13</div>
                      <div>14</div>
                      <div>15</div>
                      <div>16</div>
                      <div>17</div>
                      <div>18</div>
                      <div>19</div>
                      <div>20</div>
                      <div>21</div>
                      <div>22</div>
                      <div>23</div>
                      <div>24</div>
                      <div>25</div>
                      <div>26</div>
                      <div>27</div>
                      <div>28</div>
                      <div>29</div>
                      <div>30</div>
                      <div>31</div>
                      <div>32</div>
                    </div>
                    <code className="py-5 px-3 block text-xs">
                      {/* Imports */}
                      <span className={`block ${getHighlightClasses("imports")}`}>
                        <span className="text-[#ff7b72]">import</span>
                        <span>
                          {" "}
                          {"{"} Agent, MiroFishEngine {"}"}{" "}
                        </span>
                        <span className="text-[#ff7b72]">from</span>
                        <span className="text-[#a5d6ff]"> "@elysian/core"</span>
                        <span>;</span>
                        <br />
                        <span className="text-[#ff7b72]">import</span>
                        <span>
                          {" "}
                          {"{"} SepoliaTrustLayer {"}"}{" "}
                        </span>
                        <span className="text-[#ff7b72]">from</span>
                        <span className="text-[#a5d6ff]"> "@elysian/blockchain"</span>
                        <span>;</span>
                        <br />
                        <br />
                      </span>

                      {/* 1. Auditor Agent */}
                      <span className={`block ${getHighlightClasses("analyst")}`}>
                        <span className="text-[#8b949e]">{"// 1. Auditor Agent (Price Markup Detection)"}</span>
                        <br />
                        <span className="text-[#ff7b72]">const</span>
                        <span> auditorAgent = </span>
                        <span className="text-[#ff7b72]">new</span>
                        <span className="text-[#d2a8ff]"> Agent</span>
                        <span>{"({"}</span>
                        <br />
                        <span className="ml-4">name: </span>
                        <span className="text-[#a5d6ff]">"{t.landing.agents.items.analyst.name}"</span>
                        <span>,</span>
                        <br />
                        <span className="ml-4">instructions: </span>
                        <span className="text-[#a5d6ff]">
                          "Scan budget items against SIRUP procurement data."
                        </span>
                        <br />
                        <span>{"});"}</span>
                        <br />
                        <br />
                      </span>

                      {/* 2. Compliance Agent */}
                      <span className={`block ${getHighlightClasses("editor")}`}>
                        <span className="text-[#8b949e]">{"// 2. Compliance Agent (Legal Regulation Supervisor)"}</span>
                        <br />
                        <span className="text-[#ff7b72]">const</span>
                        <span> complianceAgent = </span>
                        <span className="text-[#ff7b72]">new</span>
                        <span className="text-[#d2a8ff]"> Agent</span>
                        <span>{"({"}</span>
                        <br />
                        <span className="ml-4">name: </span>
                        <span className="text-[#a5d6ff]">"{t.landing.agents.items.editor.name}"</span>
                        <span>,</span>
                        <br />
                        <span className="ml-4">instructions: </span>
                        <span className="text-[#a5d6ff]">
                          "Verify budget line compliance against SHR PDFs."
                        </span>
                        <br />
                        <span>{"});"}</span>
                        <br />
                        <br />
                      </span>

                      {/* 3. Manager Agent */}
                      <span className={`block ${getHighlightClasses("compliance")}`}>
                        <span className="text-[#8b949e]">{"// 3. Manager Agent (Decision Consensus Manager)"}</span>
                        <br />
                        <span className="text-[#ff7b72]">const</span>
                        <span> managerAgent = </span>
                        <span className="text-[#ff7b72]">new</span>
                        <span className="text-[#d2a8ff]"> Agent</span>
                        <span>{"({"}</span>
                        <br />
                        <span className="ml-4">name: </span>
                        <span className="text-[#a5d6ff]">"{t.landing.agents.items.compliance.name}"</span>
                        <span>,</span>
                        <br />
                        <span className="ml-4">instructions: </span>
                        <span className="text-[#a5d6ff]">
                          "Mediate agent debate and forge consensus reports."
                        </span>
                        <span>,</span>
                        <br />
                        <span className="ml-4">subAgents: [auditorAgent, complianceAgent]</span>
                        <br />
                        <span>{"});"}</span>
                        <br />
                        <br />
                      </span>

                      {/* 4. Blockchain Committer */}
                      <span className={`block ${getHighlightClasses("coder")}`}>
                        <span className="text-[#8b949e]">
                          {"// 4. Blockchain Committer (Immutable Audit Seal)"}
                        </span>
                        <br />
                        <span className="text-[#ff7b72]">const</span>
                        <span> trustLayer = </span>
                        <span className="text-[#ff7b72]">new</span>
                        <span className="text-[#d2a8ff]"> SepoliaTrustLayer</span>
                        <span>{"({"}</span>
                        <br />
                        <span className="ml-4">contractAddress: </span>
                        <span className="text-[#a5d6ff]">"0x742d35Cc6634C053..."</span>
                        <br />
                        <span>{"});"}</span>
                        <br />
                        <span className="text-[#ff7b72]">await</span>
                        <span> trustLayer.sealAudit(report.hash);</span>
                      </span>
                    </code>
                  </div>
                </pre>
              </div>

              {/* Feature Cards - Grid Layout */}
              <div className="flex w-[45%] flex-col gap-6">
                {/* Feature 1 - Auditor Agent */}
                <div className="relative h-full">
                  <div
                    className={`h-[130px] p-5 rounded-lg ${
                      highlightedSection === "analyst"
                        ? "border-1 border-solid border-slate-300 dark:border-[#5c5855] bg-slate-100 dark:bg-[#1a1a1a]"
                        : "border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:border-slate-300 dark:hover:border-[#5c5855]"
                    }  flex flex-col cursor-pointer transition-all duration-300`}
                    onMouseEnter={() => handleMouseEnter("analyst")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick("analyst")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                        <CpuChipIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                      </div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {t.landing.agents.items.analyst.name}
                      </div>
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed">
                      {t.landing.agents.items.analyst.role} &middot; {
                        locale === "id"
                          ? "Memindai usulan anggaran, membandingkan item dengan riwayat pengadaan LKPP, dan menandai anomali markup harga."
                          : "Scans budget proposals, compares line items with LKPP procurement history, and flags price markup anomalies."
                      }
                    </div>
                  </div>
                </div>

                {/* Feature 2 - Compliance Agent */}
                <div className="relative h-full">
                  <div
                    className={`h-[130px] p-5 rounded-lg ${
                      highlightedSection === "editor"
                        ? "border-1 border-solid border-slate-300 dark:border-[#5c5855] bg-slate-100 dark:bg-[#1a1a1a]"
                        : "border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:border-slate-300 dark:hover:border-[#5c5855]"
                    }  flex flex-col cursor-pointer transition-all duration-300`}
                    onMouseEnter={() => handleMouseEnter("editor")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick("editor")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                        <UserPlusIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                      </div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {t.landing.agents.items.editor.name}
                      </div>
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed">
                      {t.landing.agents.items.editor.role} &middot; {
                        locale === "id"
                          ? "Memverifikasi item anggaran terhadap Standar Harga Regional (SHR), instruksi pemerintah, dan peraturan daerah."
                          : "Verifies line items against regional price standards (SHR), government directives, and local budget regulations."
                      }
                    </div>
                  </div>
                </div>

                {/* Feature 3 - Manager Agent */}
                <div className="relative h-full">
                  <div
                    className={`h-[130px] p-5 rounded-lg ${
                      highlightedSection === "compliance"
                        ? "border-1 border-solid border-slate-300 dark:border-[#5c5855] bg-slate-100 dark:bg-[#1a1a1a]"
                        : "border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:border-slate-300 dark:hover:border-[#5c5855]"
                    }  flex flex-col cursor-pointer transition-all duration-300`}
                    onMouseEnter={() => handleMouseEnter("compliance")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick("compliance")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick("compliance");
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                        <EyeIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                      </div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {t.landing.agents.items.compliance.name}
                      </div>
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed">
                      {t.landing.agents.items.compliance.role} &middot; {
                        locale === "id"
                          ? "Memfasilitasi perdebatan otonom antar agen, menyelesaikan perbedaan pendapat, dan merumuskan konsensus audit objektif."
                          : "Facilitates autonomous debate between agents, resolves conflicting opinions, and forms an objective audit consensus."
                      }
                    </div>
                  </div>
                </div>

                {/* Feature 4 - Blockchain Committer */}
                <div className="relative h-full">
                  <div
                    className={`h-[130px] p-5 rounded-lg ${
                      highlightedSection === "coder"
                        ? "border-1 border-solid border-slate-300 dark:border-[#5c5855] bg-slate-100 dark:bg-[#1a1a1a]"
                        : "border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#101010] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] hover:border-slate-300 dark:hover:border-[#5c5855]"
                    }  flex flex-col cursor-pointer transition-all duration-300`}
                    onMouseEnter={() => handleMouseEnter("coder")}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick("coder")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-[#b8b3b0]/10 w-10 h-10 rounded-md flex items-center justify-center shrink-0">
                        <UsersIcon className="w-5 h-5 text-slate-600 dark:text-[#b8b3b0]" />
                      </div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {t.landing.agents.items.coder.name}
                      </div>
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed">
                      {t.landing.agents.items.coder.role} &middot; {
                        locale === "id"
                          ? "Menandatangani dan mengirimkan log audit konsensus akhir ke Sepolia testnet untuk membuat jejak yang tidak dapat diubah."
                          : "Signs and commits the final consensus audit log to the Sepolia testnet to create an immutable tamper-proof trail."
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
