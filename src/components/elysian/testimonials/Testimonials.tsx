import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect, useRef } from "react";

type Testimonial = {
  name: string;
  role: string;
  agency: string;
  avatar: string;
  comment: {
    id: string;
    en: string;
  };
};

const ROW1_TESTIMONIALS: Testimonial[] = [
  {
    name: "Drs. H. Ahmad Fauzi, M.Si",
    role: "Kepala Inspektorat Provinsi",
    agency: "Inspektorat DKI Jakarta",
    avatar: "AF",
    comment: {
      id: "Elysian Rebirth memotong waktu verifikasi pre-audit RAPBD kami dari 3 minggu menjadi kurang dari 10 detik. Konsensus deteksi markup antar agen MiroFish sangat akurat.",
      en: "Elysian Rebirth has cut down our RAPBD pre-audit verification time from 3 weeks to under 10 seconds. The markup detection consensus between MiroFish agents is remarkably accurate."
    }
  },
  {
    name: "Budi Santoso, SE, Ak",
    role: "Auditor Utama",
    agency: "BPK Perwakilan Jawa Barat",
    avatar: "BS",
    comment: {
      id: "Integrasi OpenViking RAG dengan Nemesis DB memastikan evaluasi standar harga regional dibandingkan langsung dengan data pengadaan historis riil. Tidak ada lagi pencarian manual.",
      en: "The integration of OpenViking RAG with Nemesis DB ensures that standard regional price evaluations are directly compared with actual historical procurement data. No more manual cross-referencing."
    }
  },
  {
    name: "Dra. Siti Aminah, M.Ak",
    role: "Kepala Sub-Auditorat",
    agency: "BPKP Perwakilan Jawa Timur",
    avatar: "SA",
    comment: {
      id: "Dengan mengunci audit trail di Sepolia Testnet, Elysian memastikan hasil pengecekan anggaran benar-benar bebas manipulasi. Ini membangun kepercayaan internal.",
      en: "By locking the audit trail on the Sepolia Testnet, Elysian ensures that the budget checks are completely tamper-proof. It builds trust inside the administration."
    }
  }
];

const ROW2_TESTIMONIALS: Testimonial[] = [
  {
    name: "Ir. H. Rinaldi, M.T",
    role: "Kepala Dinas Pekerjaan Umum",
    agency: "Dinas PU Kota Bandung",
    avatar: "HR",
    comment: {
      id: "Menggunakan Elysian untuk memeriksa draf anggaran kami sebelum diajukan menjamin kepatuhan terhadap standar LKPP. Ini sangat memitigasi risiko kesalahan administratif.",
      en: "Having Elysian check our budget draft before submission ensures compliance with LKPP standards. It significantly mitigates the risk of administrative errors."
    }
  },
  {
    name: "Andi Wijaya",
    role: "Direktur Eksekutif",
    agency: "Center for Budget Transparency",
    avatar: "AW",
    comment: {
      id: "Ini langkah besar bagi akuntabilitas anggaran publik. Masyarakat dapat menelusuri keputusan audit tanpa mengorbankan kerahasiaan operasional pemerintah.",
      en: "This is a major step forward for public budget accountability. Citizens can trace audit decisions without compromising classified government operations."
    }
  },
  {
    name: "Prof. Dr. Hendra Prasetyo",
    role: "Guru Besar Kebijakan Publik",
    agency: "Universitas Indonesia",
    avatar: "HP",
    comment: {
      id: "Elysian Rebirth membuktikan bagaimana blockchain dan konsensus swarm AI dapat mencegah markup anggaran langsung dari sumbernya, bahkan sebelum anggaran disetujui.",
      en: "Elysian Rebirth shows how blockchain and AI swarm consensus can prevent financial markup at the very source, before the budget is even approved."
    }
  }
];

const seamlessRow1 = [...ROW1_TESTIMONIALS, ...ROW1_TESTIMONIALS, ...ROW1_TESTIMONIALS];
const seamlessRow2 = [...ROW2_TESTIMONIALS, ...ROW2_TESTIMONIALS, ...ROW2_TESTIMONIALS];

export function Testimonials() {
  const { t, locale } = useTranslation();
  const [isRow1Paused, setIsRow1Paused] = useState(false);
  const [isRow2Paused, setIsRow2Paused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const TestimonialCard = ({ item }: { item: Testimonial }) => {
    return (
      <div 
        style={{ borderWidth: "1px" }}
        className="flex-shrink-0 w-[350px] p-6 rounded-lg border border-solid border-slate-200 dark:border-[#3d3a39] bg-white dark:bg-[#050507]/60 transition-colors hover:border-slate-300 dark:hover:border-[#5c5855] flex flex-col justify-between"
      >
        <p className="text-slate-700 dark:text-[#eeeeee] text-sm leading-relaxed mb-6 italic">
          "{locale === "id" ? item.comment.id : item.comment.en}"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-solid border-sky-500/30 flex items-center justify-center text-sky-400 font-semibold text-sm">
            {item.avatar}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {item.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-[#8a8380] leading-tight mt-0.5">
              {item.role} &middot; <span className="text-sky-400">{item.agency}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full overflow-hidden landing-xs:my-16 landing-md:my-36">
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.33%, 0, 0);
          }
        }
        @keyframes scrollRight {
          0% {
            transform: translate3d(-33.33%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .scroll-left-animation {
          animation: scrollLeft 45s linear infinite;
          will-change: transform;
        }
        .scroll-right-animation {
          animation: scrollRight 45s linear infinite;
          will-change: transform;
        }
        .animation-paused {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="w-full bg-slate-50 dark:bg-[#101010] relative z-10 py-10 border-y border-slate-100 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-left max-w-xl">
            <p className="landing-xs:text-sm landing-md:text-lg landing-xs:mb-2 landing-md:mb-4 font-semibold text-slate-600 dark:text-[#b8b3b0] tracking-wide uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 inline-block animate-pulse" />
              {locale === "id" ? "Ulasan Kredibel" : "Credible Testimonials"}
            </p>
            <h2 className="mt-1 landing-xs:text-2xl landing-md:text-4xl landing-xs:mb-2 landing-md:mb-4 text-slate-900 dark:text-white sm:text-5xl font-normal">
              {locale === "id" ? "Apa Kata Para Pengawas?" : "What Are Supervisors Saying?"}
            </h2>
          </div>
        </div>
      </div>

      {/* Testimonials Rows */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div
          className="flex overflow-hidden relative"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)"
          }}
          onMouseEnter={() => setIsRow1Paused(true)}
          onMouseLeave={() => setIsRow1Paused(false)}
        >
          <div className={`flex gap-6 py-4 scroll-left-animation ${isRow1Paused || !isVisible ? "animation-paused" : ""}`}>
            {seamlessRow1.map((item, idx) => (
              <TestimonialCard key={`row1-${idx}`} item={item} />
            ))}
          </div>
        </div>

        <div
          className="flex overflow-hidden relative mt-6"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
            maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)"
          }}
          onMouseEnter={() => setIsRow2Paused(true)}
          onMouseLeave={() => setIsRow2Paused(false)}
        >
          <div className={`flex gap-6 py-4 scroll-right-animation ${isRow2Paused || !isVisible ? "animation-paused" : ""}`}>
            {seamlessRow2.map((item, idx) => (
              <TestimonialCard key={`row2-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
