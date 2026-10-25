'use client'

export function BackgroundPattern() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Ambient Lighting Glow Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-500/20 to-amber-500/25 blur-[120px] dark:from-purple-900/40 dark:via-indigo-950/35 dark:to-amber-900/25" />
      <div className="absolute top-[750px] -left-48 h-[550px] w-[700px] rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-emerald-500/20 blur-[130px] dark:from-blue-950/35 dark:to-cyan-950/25" />
      <div className="absolute top-[1500px] -right-48 h-[600px] w-[700px] rounded-full bg-gradient-to-l from-orange-500/20 via-amber-500/20 to-rose-500/20 blur-[130px] dark:from-orange-950/30 dark:to-rose-950/30" />

      {/* 2. Visible Studio Acoustic Grid Pattern */}
      <div
        className="absolute inset-0 size-full"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.35) 2px, transparent 2px),
            linear-gradient(to right, rgba(147, 51, 234, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(147, 51, 234, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        }}
      />

      {/* 3. High-Definition SVG Audio Waves & Acoustic Broadcast Rings */}
      <svg
        className="absolute inset-0 size-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Gradient for Top Soundwave Ribbon (Purple -> Pink -> Cyan) */}
          <linearGradient id="soundwave-neon-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.0" />
            <stop offset="20%" stopColor="#9333EA" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
          </linearGradient>

          {/* Gradient for Second Soundwave (Amber -> Orange -> Rose) */}
          <linearGradient id="soundwave-neon-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.0" />
            <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.7" />
            <stop offset="65%" stopColor="#F97316" stopOpacity="0.75" />
            <stop offset="85%" stopColor="#E11D48" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="0.0" />
          </linearGradient>

          {/* Gradient for Third Soundwave (Teal -> Emerald -> Indigo) */}
          <linearGradient id="soundwave-neon-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14B386" stopOpacity="0.0" />
            <stop offset="35%" stopColor="#14B386" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#6366F1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>

          {/* Corner Kona Crosshair Matrix Motif */}
          <pattern id="kona-crosses" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 60 52 L 60 68 M 52 60 L 68 60"
              fill="none"
              stroke="#9333EA"
              strokeWidth="2"
              opacity="0.25"
            />
            {/* 45-degree diagonal accents */}
            <line x1="105" y1="15" x2="115" y2="5" stroke="#EC4899" strokeWidth="1.5" opacity="0.3" />
            <line x1="5" y1="115" x2="15" y2="105" stroke="#06B6D4" strokeWidth="1.5" opacity="0.3" />
          </pattern>
        </defs>

        {/* Diagonal Cross Matrix */}
        <rect width="100%" height="100%" fill="url(#kona-crosses)" />

        {/* Broadcast Acoustic Transmission Ripples (Radiating behind the Top/Hero) */}
        <g transform="translate(680, 260)" fill="none">
          <circle cx="0" cy="0" r="160" stroke="#9333EA" strokeWidth="2" strokeDasharray="6 8" opacity="0.45" />
          <circle cx="0" cy="0" r="300" stroke="#EC4899" strokeWidth="2" strokeDasharray="8 10" opacity="0.4" />
          <circle cx="0" cy="0" r="460" stroke="#3B82F6" strokeWidth="2" strokeDasharray="10 14" opacity="0.35" />
          <circle cx="0" cy="0" r="640" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="12 16" opacity="0.3" />
          <circle cx="0" cy="0" r="840" stroke="#10B981" strokeWidth="1.5" strokeDasharray="14 18" opacity="0.25" />

          {/* Radial Axis Crosshairs */}
          <line x1="-1000" y1="0" x2="1000" y2="0" stroke="#9333EA" strokeWidth="1.2" strokeDasharray="8 8" opacity="0.25" />
          <line x1="0" y1="-500" x2="0" y2="900" stroke="#9333EA" strokeWidth="1.2" strokeDasharray="8 8" opacity="0.25" />
        </g>

        {/* Prominent Audio Frequency Waveforms running across the page */}
        <g fill="none">
          {/* Wave 1: Hero-level dynamic frequency wave */}
          <path
            d="M -50 180 Q 250 70, 600 220 T 1250 150 T 1850 240 T 2450 140"
            stroke="url(#soundwave-neon-1)"
            strokeWidth="3.5"
            strokeDasharray="14 7"
          />

          {/* Wave 2: Vocal frequency contour */}
          <path
            d="M -50 360 Q 350 500, 850 330 T 1650 440 T 2350 310"
            stroke="url(#soundwave-neon-2)"
            strokeWidth="3"
          />

          {/* Wave 3: Mid-page bass wave */}
          <path
            d="M -50 680 Q 400 540, 1000 700 T 1950 620 T 2550 720"
            stroke="url(#soundwave-neon-1)"
            strokeWidth="2.5"
            strokeDasharray="10 8"
          />

          {/* Wave 4: Lower resonance rhythm wave */}
          <path
            d="M -50 1120 Q 450 1280, 1100 1060 T 2050 1180 T 2650 1080"
            stroke="url(#soundwave-neon-3)"
            strokeWidth="2.5"
          />

          {/* Wave 5: Deep ambient wave */}
          <path
            d="M -50 1580 Q 550 1420, 1200 1620 T 2150 1500 T 2750 1640"
            stroke="url(#soundwave-neon-2)"
            strokeWidth="2.2"
            strokeDasharray="8 10"
          />
        </g>

        {/* Decorative "Kona" (Corner) Corner Frame Brackets in Viewport */}
        <g stroke="#9333EA" strokeWidth="3" fill="none" opacity="0.5">
          {/* Top Left Corner */}
          <path d="M 28 72 L 28 28 L 72 28" />
          <path d="M 72 28 L 120 28" strokeDasharray="5 5" />
        </g>
      </svg>
    </div>
  )
}
