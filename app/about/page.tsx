import AboutClient from "./about-client";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Elysian",
  description: "Why we built Elysian?",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080f11d9]">
      <LandingNavbar forceDark={true} />
      <main className="flex-1 relative overflow-hidden py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
          <AboutClient />
        </div>
      </main>
    </div>
  );
}
