'use client';

import React from 'react';
import { motion } from 'framer-motion';

const NAV_COLUMNS = [
  ['Reels', 'Services'],
  ['Projects', 'Pipeline'],
  ['Careers', 'Get In Touch'],
];

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260223_060517_9feec9ab-18e4-477a-b034-de5903a67e91.mp4';
const SHIPPING_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260223_063954_03a5f7ec-5f10-4acb-ba8d-dce4815217db.mp4';
const MARQUEE_TEXT = 'New! 3D^OS V1.2.1 out now!';

function TicketCartIcon() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="27"
        height="30"
        viewBox="0 0 27 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.5 2C3.5 2 1 2 1 4.5V13.5C2.933 13.5 4.5 15.067 4.5 17C4.5 18.933 2.933 20.5 1 20.5V25.5C1 28 3.5 28 3.5 28H23.5C23.5 28 26 28 26 25.5V20.5C24.067 20.5 22.5 18.933 22.5 17C22.5 15.067 24.067 13.5 26 13.5V4.5C26 2 23.5 2 23.5 2H3.5Z"
          fill="white"
        />
        <circle cx="13.5" cy="7" r="1" fill="black" />
        <circle cx="13.5" cy="11" r="1" fill="black" />
        <circle cx="13.5" cy="23" r="1" fill="black" />
        <circle cx="13.5" cy="27" r="0.5" fill="black" />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-black"
        style={{ paddingBottom: '2px' }}
      >
        0
      </span>
    </div>
  );
}

export function FramelixDarkMode() {
  return (
    <div className="w-full bg-black text-white font-sans min-h-screen selection:bg-white/20">
      {/* 1. Navbar */}
      <nav
        className="w-full flex items-center justify-between"
        style={{ paddingLeft: 36, paddingRight: 36, paddingTop: 32, paddingBottom: 20 }}
      >
        <div className="flex items-center flex-shrink-0">
          <span
            className="text-white font-semibold tracking-tight select-none"
            style={{ fontSize: 22, letterSpacing: '-0.03em' }}
          >
            Framelix
            <sup className="text-[13px] font-medium ml-0.5">3D</sup>
          </span>
        </div>

        <div className="hidden md:flex items-start" style={{ gap: 64 }}>
          {NAV_COLUMNS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-2">
              {col.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white text-[14px] font-medium hover:opacity-60 transition-opacity duration-150 whitespace-nowrap"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity duration-150">
          <TicketCartIcon />
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Overlay agar teks terbaca (Accessibility) */}
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none z-0" />

        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Overlay top – brand + headline */}
          <motion.div
            className="absolute top-[50px] left-0 right-0 flex flex-col items-center text-center px-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="text-white font-medium tracking-tight" style={{ fontSize: 26 }}>
              Framelix
              <sup className="font-medium" style={{ fontSize: 16 }}>3D</sup>
            </p>
            <h1
              className="text-white font-medium leading-tight mt-1"
              style={{ fontSize: 'clamp(2rem, 6vw, 68px)', letterSpacing: '-0.02em' }}
            >
              Cinematic Motion Studios
            </h1>
          </motion.div>

          {/* Overlay bottom – CTA */}
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center gap-3 px-4"
            style={{ bottom: '12%' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <button
              className="bg-white text-black rounded-full font-semibold hover:opacity-90 transition-opacity duration-200"
              style={{ fontSize: 22, paddingLeft: 56, paddingRight: 56, paddingTop: 16, paddingBottom: 16 }}
            >
              Explore Reel
            </button>
            <p className="font-medium text-white/50" style={{ fontSize: 14 }}>
              Ready in 24-48 hours
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Marquee Banner */}
      <div
        className="w-full overflow-hidden flex items-center"
        style={{ backgroundColor: '#A6A4FF', paddingTop: 14, paddingBottom: 14 }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="flex-shrink-0 text-black font-medium text-[16px]"
              style={{ marginRight: 60 }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Shipping Section */}
      <section
        className="w-full flex justify-center text-black overflow-hidden relative"
        style={{
          backgroundColor: '#EAEAEA',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <div className="w-full max-w-[1400px] flex flex-col items-center" style={{ paddingTop: 64, paddingBottom: 128 }}>
          {/* Top heading */}
          <div className="text-center mb-0 px-4">
            <p className="font-medium tracking-tight" style={{ fontSize: 20 }}>
              Framelix
              <sup className="font-medium" style={{ fontSize: 13 }}>3D</sup>
            </p>
            <h2
              className="font-medium leading-tight mt-1"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 52px)', letterSpacing: '-0.02em' }}
            >
              Shipping Now
            </h2>
          </div>

          {/* Center video with negative vertical margin */}
          <div className="-my-24 z-0">
            <video
              src={SHIPPING_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="rounded-2xl object-cover"
              width={800}
              height={800}
              style={{ width: 800, height: 800, maxWidth: '100vw' }}
            />
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col items-center gap-3 mt-0 relative z-10">
            <button
              className="bg-black text-white rounded-full font-semibold hover:opacity-80 transition-opacity duration-200"
              style={{ fontSize: 18, paddingLeft: 184, paddingRight: 184, paddingTop: 12, paddingBottom: 12 }}
            >
              Buy Now
            </button>
            <p className="tracking-tight" style={{ fontSize: 20, fontWeight: 450 }}>
              Explore now
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
