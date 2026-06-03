import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type CodeExampleProps = {
  featureType: "dev" | "docs" | "insights";
};

export const CodeExample = ({
  featureType = "dev",
}: CodeExampleProps) => {
  // Code examples for each feature type aligned with Elysian Rebirth
  const codeExamples = {
    dev: (
      <>
        <span className="text-[#ff7b72]">import</span>{" "}
        <span className="text-[#f0f6fc]">{"{ Agent, MiroFishEngine }"}</span>{" "}
        <span className="text-[#ff7b72]">from</span>{" "}
        <span className="text-[#a5d6ff]">'@elysian/core'</span>
        <br />
        <br />
        <span className="text-[#8b949e]">{/* Define Specialist Auditing Agents */}</span>
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">auditor</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">new Agent</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  name: </span>
        <span className="text-[#a5d6ff]">"Auditor Agent"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">  instructions: </span>
        <span className="text-[#a5d6ff]">"Detect price markup and anomalies."</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">compliance</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">new Agent</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  name: </span>
        <span className="text-[#a5d6ff]">"Compliance Agent"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">  instructions: </span>
        <span className="text-[#a5d6ff]">"Enforce regional regulations."</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#8b949e]">{/* Orchestrate the Swarm Debate for Consensus */}</span>
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">swarm</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">new MiroFishEngine</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  agents: {"{ auditor, compliance, manager }"},</span>
        <br />
        <span className="text-[#f0f6fc]">  maxDebateRounds: </span>
        <span className="text-[#a5d6ff]">3</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">result</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">await</span>{" "}
        <span className="text-[#f0f6fc]">swarm.</span>
        <span className="text-[#a5d6ff]">audit</span>
        <span className="text-[#f0f6fc]">(budgetPdf);</span>
      </>
    ),
    docs: (
      <>
        <span className="text-[#ff7b72]">import</span>{" "}
        <span className="text-[#f0f6fc]">{"{ OpenVikingRag, NemesisDB }"}</span>{" "}
        <span className="text-[#ff7b72]">from</span>{" "}
        <span className="text-[#a5d6ff]">'@elysian/rag'</span>
        <br />
        <br />
        <span className="text-[#8b949e]">{/* Connect Ground Truth (4GB+ SIRUP LKPP) */}</span>
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">nemesis</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">new NemesisDB</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  collection: </span>
        <span className="text-[#a5d6ff]">"sirup-procurement-2025"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#8b949e]">{/* Setup Semantic search across Regulations */}</span>
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">rag</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">new OpenVikingRag</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  vectorDb: </span>
        <span className="text-[#a5d6ff]">"qdrant"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">  groundTruth: nemesis,</span>
        <br />
        <span className="text-[#f0f6fc]">  topK: </span>
        <span className="text-[#a5d6ff]">10</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">priceTruth</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">await</span>{" "}
        <span className="text-[#f0f6fc]">rag.</span>
        <span className="text-[#a5d6ff]">verifyPrice</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  itemName: </span>
        <span className="text-[#a5d6ff]">"Laptop Core i7 16GB"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">  proposedPrice: </span>
        <span className="text-[#a5d6ff]">18500000</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
      </>
    ),
    insights: (
      <>
        <span className="text-[#ff7b72]">import</span>{" "}
        <span className="text-[#f0f6fc]">{"{ SepoliaTrustLayer }"}</span>{" "}
        <span className="text-[#ff7b72]">from</span>{" "}
        <span className="text-[#a5d6ff]">'@elysian/blockchain'</span>
        <br />
        <br />
        <span className="text-[#8b949e]">{/* Setup Public EVM Trust Seal */}</span>
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">trustLayer</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">new SepoliaTrustLayer</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  network: </span>
        <span className="text-[#a5d6ff]">"sepolia-testnet"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">  contractAddress: </span>
        <span className="text-[#a5d6ff]">"0x742d35Cc6634C053..."</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#8b949e]">{/* Commit Cryptographic Proof on-chain */}</span>
        <br />
        <span className="text-[#ff7b72]">const</span> <span className="text-[#f0f6fc]">transaction</span>{" "}
        <span className="text-[#8b949e]">=</span> <span className="text-[#ff7b72]">await</span>{" "}
        <span className="text-[#f0f6fc]">trustLayer.</span>
        <span className="text-[#a5d6ff]">sealAudit</span>
        <span className="text-[#f0f6fc]">({"{"}</span>
        <br />
        <span className="text-[#f0f6fc]">  auditId: </span>
        <span className="text-[#a5d6ff]">"AUDIT-2026-RAPBD-04"</span>
        <span className="text-[#f0f6fc]">,</span>
        <br />
        <span className="text-[#f0f6fc]">  documentHash: result.hash,</span>
        <br />
        <span className="text-[#f0f6fc]">  consensusSeal: result.consensusSignature,</span>
        <br />
        <span className="text-[#f0f6fc]">{"});"}</span>
        <br />
        <br />
        <span className="text-[#ff7b72]">console.</span>
        <span className="text-[#a5d6ff]">log</span>
        <span className="text-[#f0f6fc]">(</span>
        <span className="text-[#a5d6ff]">{"`Audit sealed on-chain: ${transaction.hash}`"}</span>
        <span className="text-[#f0f6fc]">);</span>
      </>
    ),
  };

  // Animation variants for code content
  const codeBlockVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  return (
    <div className="relative">
      <div
        style={{ borderWidth: "1px" }}
        className="max-w-4xl relative overflow-y-hidden border border-solid border-[#3d3a39] hover:border-[#5c5855] transition-colors duration-300 rounded-lg"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-[3px] rounded-t-lg landing-xs:hidden landing-md:block"
          style={{
            background:
              "linear-gradient(45deg, rgb(56, 189, 248), rgb(14, 165, 233), rgb(56, 189, 248), rgb(3, 105, 161)) 0% 0% / 300%",
            boxShadow:
              "0 0 15px 3px rgba(56, 189, 248, 0.4), 0 0 30px 6px rgba(56, 189, 248, 0.15)",
          }}
        />
        <pre className="text-left bg-[#020202] overflow-hidden rounded-lg p-0 text-sm font-mono m-0 landing-md:h-[340px] landing-xs:h-[275px]">
          <div className="flex">
            <div className="py-7 px-2 text-right text-[#8b949e]  leading-[1.4] select-none border-r border-[#3d3a39] min-w-[40px] landing-xs:text-[9px] landing-md:text-xs">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <div className="py-7 px-3 block landing-xs:text-[9px] landing-md:text-xs  w-full relative">
              <motion.div
                className="absolute inset-0 bg-[#38bdf8]/6 rounded-r"
                layoutId="agentsDetailCodeHighlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <AnimatePresence mode="wait">
                <motion.code
                  key={featureType}
                  variants={codeBlockVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="block relative leading-[1.4] z-10 "
                >
                  {codeExamples[featureType]}
                </motion.code>
              </AnimatePresence>
            </div>
          </div>
        </pre>
      </div>
    </div>
  );
};
