"use client";

import confetti from "canvas-confetti";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin as LinkedInLogo, Twitter as XLogo, Github, Globe, ShieldCheck } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface Stargazer {
  login: string;
  avatar_url: string;
}

const SUDO_CODE = ["s", "u", "d", "o"];

// Remove inline SVG components since we're now importing them
// const TwitterIcon = () => (...)
// const LinkedInIcon = () => (...)

// Skeleton loaders for different content types
const SkeletonText = ({ width = "100%", height = "1rem" }) => (
  <div className="animate-pulse bg-gray-600/30 rounded" style={{ width, height }} />
);

const SkeletonAvatar = ({ size = "w-12 h-12" }) => (
  <div className={`${size} rounded-full animate-pulse bg-gray-600/30 mb-2`} />
);

export default function AboutClient() {
  const [_, setKeys] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [stars, setStars] = useState<number>(0);
  const [recentStargazers, setRecentStargazers] = useState<Stargazer[]>([]);
  const [loading, setLoading] = useState(true);
  const [founderImgSrc, setFounderImgSrc] = useState("/assets/matt-founder.png");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setKeys((prevKeys) => {
        const updatedKeys = [...prevKeys, key];
        if (updatedKeys.length > SUDO_CODE.length) {
          updatedKeys.shift();
        }
        if (updatedKeys.join("") === SUDO_CODE.join("")) {
          setShowEasterEgg(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          setTimeout(() => setShowEasterEgg(false), 60000);
        }
        return updatedKeys;
      });
    };

    // Fetch contributors and stargazers data
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contributorsResponse, loveResponse] = await Promise.all([
          fetch("https://love.voltagent.dev/api/contributors"),
          fetch("https://love.voltagent.dev/api/love"),
        ]);

        const contributorsData = await contributorsResponse.json();
        const loveData = await loveResponse.json();

        setContributors(contributorsData.contributors);
        setStars(loveData.stars);
        setRecentStargazers(loveData.recent_stargazers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEasterEggClose = () => {
    setShowEasterEgg(false);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 [&_a]:no-underline">
      <DotPattern dotColor="#94a3b8" dotSize={1.2} spacing={20} />
      <div className="mb-6">
        <h2 className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-3 font-semibold text-sky-500 tracking-wide uppercase">
          About us
        </h2>
        <p className="mt-1 landing-xs:text-2xl landing-md:text-3xl landing-xs:mb-2 landing-md:mb-3 landing-xs:font-bold landing-md:font-extrabold text-white sm:tracking-tight">
          Why We Built Elysian
        </p>
        <p className="max-w-2xl landing-md:text-sm landing-xs:text-xs text-[#dcdcdc]">
          Simplifying AI in the JavaScript ecosystem.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col space-y-4 max-w-4xl">
        <p className="text-[#dcdcdc] leading-relaxed">
          We're developers, like you, and we started this project based on our own experiences.
          We've built over 15 open-source projects before this, and each one taught us something
          new. Our biggest project, Refine, showed us how powerful working with a community can be.
          During our time building Refine - one of us as co-founder and CTO, the other as Growth
          Lead - we saw amazing things happen when the community came together. That experience
          changed us, and we're incredibly thankful to everyone in the Refine community.
        </p>

        <p className="text-[#dcdcdc] leading-relaxed">
          Now, we're starting something new and exciting: Elysian. We know AI development can
          often feel like working with a confusing "black box," regardless of the language. However,
          the AI ecosystem is heavily dominated by Python, which has more mature tools and
          established practices. We felt this left JavaScript developers without adequate solutions.
          That's why we're building Elysian – to bring better clarity, real-world{" "}
          <Link href="/usecases" className="text-sky-400 hover:underline font-semibold">
            use cases
          </Link>
          , and best practices specifically to the JavaScript AI world.
        </p>

        <p className="text-[#dcdcdc] leading-relaxed">
          We looked into No-Code tools too. Their visual approach to making AI less complex was
          interesting. Building workflows visually was neat and made things easier to understand.
          However, we quickly ran into problems: we felt locked in and couldn't customize things the
          way we wanted. We realized we needed the flexibility of code, but also the clear view that
          visual tools provided.
        </p>

        <p className="text-[#dcdcdc] leading-relaxed">
          And that's why Elysian exists. We're creating the tool we always wanted – one that
          combines the great developer experience you get with code, and the easy-to-understand
          insights from No-Code tools. Our goal is to make AI development easier, clearer, and more
          powerful, and we want to build it together with the community. We're just getting started
          and we're excited to have you join us.
        </p>
        <p className="text-[#dcdcdc] leading-relaxed">
          Thanks to all the amazing tools in the AI development and observability ecosystem that
          inspired us.
        </p>
      </div>

      {/* Founder E-E-A-T Section */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <h2 className="landing-xs:text-sm landing-md:text-lg text-center landing-xs:mb-2 landing-md:mb-3 font-semibold text-sky-500 tracking-wide uppercase">
          Founder Profile & Vision
        </h2>
        <div className="mt-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 md:p-8 hover:border-sky-500/20 transition-all duration-300 max-w-3xl mx-auto backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-sky-500/40 flex-shrink-0 bg-slate-800 relative">
              <Image
                src={founderImgSrc}
                alt="Rahmat Yudi Burhanudin"
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
                onError={() => {
                  // Keep the broken image icon or handle gracefully instead of showing another person
                }}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">Rahmat Yudi Burhanudin</h3>
                  <p className="text-sky-400 text-sm font-medium">Founder & Emerging Systems Architect</p>
                </div>
                <div className="flex justify-center md:justify-end gap-2.5">
                  <a
                    href="https://github.com/MattYudha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/rahmat-yudi-burhanudin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedInLogo className="w-4 h-4" />
                  </a>
                  <a
                    href="http://www.portofoliomatt.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all cursor-pointer"
                    aria-label="Personal Portfolio"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Banyak pengguna yang bertanya tentang <strong>apa itu Elysian</strong> dan <strong>siapa pembuat Elysian?</strong> Elysian AI secara resmi dibangun, diarsiteki, dan dikembangkan secara independen oleh <strong>Rahmat Yudi Burhanudin</strong>. Sebagai kreator dan pemegang visi utama, Elysian punya Rahmat Yudi difokuskan untuk menyederhanakan orkestrasi AI bagi perusahaan. Rahmat Yudi (Elysian Rahmat / MattYudha) adalah Full-Stack Developer & Systems Architect spesialis <em>production-grade solutions</em>.
                <br /><br />
                Sebelum membangun Elysian Rebirth, ia telah mengarsiteki dan meluncurkan <a href="https://floodzy.id" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-semibold">Floodzy</a>, platform pemantauan cuaca dan bencana nasional *real-time* untuk Indonesia yang ditenagai oleh Gemini AI dan telemetri multi-sumber (BMKG, OpenWeatherMap, dan PetaBencana).
              </p>
              <div className="border-t border-slate-800 pt-4 mt-4 text-left">
                <h4 className="text-xs font-semibold text-sky-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Core Expertise & E-E-A-T Credentials
                </h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Developed enterprise modules using React, Next.js, and Node.js at PT Telekomunikasi Indonesia (Telkom).</li>
                  <li>• Engineered precision digital twin SAWIT SHIELD (Greenpace) with geofenced tracking and Cognitive Swarm AI.</li>
                  <li>• Backed by blockchain verification layers for immutable auditing in regional procurement systems.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* GitHub Contributors Section */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <h2 className="landing-xs:text-sm landing-md:text-lg text-center landing-xs:mb-2 landing-md:mb-3 font-semibold text-sky-500 tracking-wide uppercase">
          GitHub Contributors
        </h2>
        <p className="text-center max-w-2xl mx-auto landing-md:text-sm landing-xs:text-xs text-[#dcdcdc] mb-6">
          Thanks to all the community developers who help us to improve Elysian!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 max-w-4xl mx-auto mt-6">
          {loading
            ? // Skeleton loading for contributors
              Array(13)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`skeleton-contributor-${i}-${Date.now()}`}
                    className="flex flex-col items-center"
                  >
                    <SkeletonAvatar />
                    <SkeletonText width="60%" height="0.75rem" />
                  </div>
                ))
            : contributors?.map((contributor) => (
                <a
                  key={contributor.login}
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group flex flex-col items-center no-underline text-decoration-none"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-500/40 mb-2 group-hover:border-sky-500 transition-all relative">
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[#dcdcdc] text-xs group-hover:text-sky-500 transition-colors no-underline">
                    {contributor.login}
                  </span>
                </a>
              ))}
        </div>
      </div>

      {/* Contribute CTA */}
      <div className="flex justify-center mt-8">
        <a
          href="https://elysian.dev/docs/community/contributing/"
          className="inline-flex items-center no-underline bg-sky-400/10 text-sky-400 
          border-solid border border-sky-400/20 text-sm font-semibold rounded transition-colors cursor-pointer hover:bg-sky-400/20"
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <div className="flex items-center justify-center px-6 py-2">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>How to Contribute?</span>
          </div>
        </a>
      </div>

      {/* GitHub Stargazers Section */}
      <div className="mt-16 border-t border-white/10 pt-12">
        <h2 className="landing-xs:text-sm landing-md:text-lg text-center landing-xs:mb-2 landing-md:mb-3 font-semibold text-sky-500 tracking-wide uppercase">
          Supporters
        </h2>
        <p className="text-center max-w-2xl mx-auto landing-md:text-sm landing-xs:text-xs text-[#dcdcdc] mb-6">
          <span className="text-sky-500 font-semibold">{loading ? "..." : stars}</span> GitHub
          stars and growing! Recent supporters:
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-3 sm:gap-4 max-w-4xl mx-auto mt-6">
          {loading ? (
            // Skeleton loading for stargazers
            Array(10)
              .fill(0)
              .map((_, i) => (
                <div key={`skeleton-stargazer-${i}-${Date.now()}`} className="flex justify-center">
                  <SkeletonAvatar />
                </div>
              ))
          ) : (
            <>
              {recentStargazers?.slice(0, 9).map((stargazer) => (
                <a
                  key={stargazer.login}
                  href={`https://github.com/${stargazer.login}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="group no-underline text-decoration-none"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-500/30 group-hover:border-sky-500 transition-all relative">
                    <Image
                      src={stargazer.avatar_url}
                      alt={stargazer.login}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </a>
              ))}
              {/* Last cell showing remaining count */}
              <a
                href="https://github.com/Elysian/elysian/stargazers"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group no-underline text-decoration-none"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-500/30 group-hover:border-sky-500 transition-all bg-sky-400/20 flex items-center justify-center">
                  <div className="text-sky-500 font-semibold text-xs">+{stars - 9}</div>
                </div>
              </a>
            </>
          )}
        </div>

        {/* Contribute CTA */}
        <div className="flex justify-center mt-8">
          <a
            href="https://github.com/Elysian/elysian/"
            className="inline-flex items-center  w-[205px] no-underline bg-sky-400/10 text-sky-400 
            border-solid border border-sky-400/20 text-sm  font-semibold rounded transition-colors cursor-pointer hover:bg-sky-400/20 group"
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <div className="flex items-center  w-full justify-center px-3 py-2">
              <svg
                className="w-5 h-5 mr-2 text-sky-400 group-hover:text-yellow-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="block group-hover:hidden">How to Support?</span>
              <span className="hidden group-hover:block">Star us on GitHub</span>
            </div>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-white/10">
        <p className="font-medium text-white mb-2 text-sm">Elysian Team</p>
        <p className="text-xs text-[#dcdcdc] font-mono">Permission denied? Try sudo...</p>
      </div>

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <dialog
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleEasterEggClose}
          onKeyDown={(e) => e.key === "Escape" && handleEasterEggClose()}
          open
        >
          <div
            className="bg-gray-800 p-5 rounded-xl max-w-2xl w-full text-left shadow-xl border border-gray-700 flex flex-col"
            style={{ fontFamily: "sans-serif" }}
          >
            {/* Chat Header */}
            <div className="text-center mb-4 pb-3 border-b border-gray-600">
              <h3 className="text-lg font-medium text-white">Elysian Insights ✨</h3>
            </div>

            {/* Chat Body - Added max height and overflow */}
            <div className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-2 flex-grow custom-scrollbar">
              {/* Fun Facts Section (as system message/block) */}
              <div className="p-3 rounded-lg bg-gray-700/60">
                <p className="text-sky-400 font-semibold mb-2 text-[13px]">Did you know?</p>
                {/* Kept monospace for facts list for alignment */}
                <pre className="whitespace-pre-wrap text-gray-300 text-xs font-mono leading-relaxed">
                  {`[1] First Elysian prototype was sketched on a coffee shop napkin ☕️
[2] Debugging LLM hallucinations took way more coffee than expected...
[3] We argued for 3 days straight about visualizing agent state 🤔
[4] Our internal Slack bot crashed parsing a 50-level nested JSON response
[5] We almost named the project 'JSAgentFlow' (good call changing it!)
[6] Most complex test agent had 12 interconnected nodes 🤯
[7] The 'aha!' moment for observability came during a late-night debugging session 🔥
[8] Lines of JS code written for Elysian: Still counting... and refactoring!
[9] Favorite team debugging snack: Probably gummy bears 🐻
[10] We truly believe JS deserves first-class AI tooling! 🚀`}
                </pre>
              </div>

              {/* Benchmark Section (as another system message/block) */}
              <div className="p-3 rounded-lg bg-gray-700/60">
                <p className="text-sky-400 font-semibold mb-2 text-[13px]">
                  Agent Development Benchmark (Conceptual):
                </p>
                {/* Kept monospace for table */}
                <pre className="text-gray-300 text-xs font-mono">
                  {`
┌────────────────────┬───────────────┬──────────────┐
│ Metric             │ Manual JS       │ Elysian  │
├────────────────────┼───────────────┼──────────────┤
│ Agent Setup Time   │    ~4 hours   │   ~15 mins   │
│ Debugging Time     │   ??? hours   │   ~30 mins   │
│ Observability      │ Low (console) │  High (UI)   │
│ State Mgmt Lines   │    200+ LoC   │    ~20 LoC   │
│ Iteration Speed    │      Slow     │     Fast     │
└────────────────────┴───────────────┴──────────────┘`}
                </pre>
              </div>

              {/* Final bot message */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-sky-600/30 to-sky-600/30 text-gray-300 text-xs italic">
                Elysian aims to bring this level of clarity and speed to your AI projects!
              </div>
            </div>

            {/* Footer - Updated text */}
            <div className="text-gray-500 text-xs mt-4 text-center pt-3 border-t border-gray-600">
              Press ESC or click outside to close
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
