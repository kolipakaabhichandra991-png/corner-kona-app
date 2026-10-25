'use client'

export function BackgroundPattern() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic Ambient Gradient Halos */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-gradient-to-tr from-purple-600/15 via-pink-500/10 to-amber-500/15 blur-[130px] dark:from-purple-900/30 dark:via-indigo-950/25 dark:to-amber-900/20" />
      <div className="absolute top-[800px] -left-40 h-[500px] w-[650px] rounded-full bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-emerald-500/10 blur-[140px] dark:from-blue-950/25 dark:to-cyan-950/15" />
      <div className="absolute top-[1600px] -right-40 h-[550px] w-[650px] rounded-full bg-gradient-to-l from-orange-500/10 via-amber-500/10 to-rose-500/10 blur-[130px] dark:from-orange-950/20 dark:to-rose-950/20" />

      {/* SVG Contextual Pattern: Acoustic Studio Matrix + Audio Waveforms + Corner Kona Geometry */}
      <svg
        className="absolute inset-0 size-full text-foreground/40 dark:text-foreground/30 opacity-70 [mask-image:radial-gradient(ellipse_100%_85%_at_50%_15%,black_40%,transparent_100%)]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Pattern 1: Acoustic Studio Micro-Dot Grid */}
          <pattern
            id="acoustic-studio-dots"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="currentColor" opacity="0.12" />
            <circle cx="20" cy="20" r="0.8" fill="currentColor" opacity="0.08" />
          </pattern>

          {/* Pattern 2: "Kona" (Corner) Geometric Diagonal Accent Lines */}
          <pattern
            id="kona-corner-grid"
            width="144"
            height="144"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 144 0 L 0 144 M 0 0 L 144 144"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              opacity="0.07"
            />
            {/* Corner Bracket / Kona Mark */}
            <path
              d="M 12 4 L 4 4 L 4 12 M 132 4 L 140 4 L 140 12 M 4 132 L 4 140 L 12 140 M 140 132 L 140 140 L 132 140"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.15"
            />
          </pattern>

          {/* Gradient for Soundwave Strokes */}
          <linearGradient id="soundwave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.0" />
            <stop offset="25%" stopColor="#9333EA" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#EC4899" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="soundwave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Layer 1: Base Acoustic Dot Grid */}
        <rect width="100%" height="100%" fill="url(#acoustic-studio-dots)" />

        {/* Layer 2: Geometric Kona Grid */}
        <rect width="100%" height="100%" fill="url(#kona-corner-grid)" />

        {/* Layer 3: Concentric Podcast Broadcast Audio Rings (Centered behind Hero) */}
        <g transform="translate(680, 260)" fill="none" opacity="0.6">
          <circle cx="0" cy="0" r="160" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" opacity="0.15" />
          <circle cx="0" cy="0" r="280" stroke="currentColor" strokeWidth="1" strokeDasharray="3 9" opacity="0.12" />
          <circle cx="0" cy="0" r="420" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" opacity="0.1" />
          <circle cx="0" cy="0" r="580" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" opacity="0.08" />
          <circle cx="0" cy="0" r="760" stroke="currentColor" strokeWidth="1" strokeDasharray="12 12" opacity="0.06" />
          <circle cx="0" cy="0" r="960" stroke="currentColor" strokeWidth="1" opacity="0.04" />

          {/* Radial acoustic axis lines */}
          <line x1="-800" y1="0" x2="800" y2="0" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 8" opacity="0.08" />
          <line x1="0" y1="-500" x2="0" y2="700" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 8" opacity="0.08" />
        </g>

        {/* Layer 4: Organic Soundwave Frequency Contours across the page */}
        <g fill="none">
          {/* High-frequency melody soundwave */}
          <path
            d="M -100 220 Q 200 120, 500 240 T 1100 200 T 1700 260 T 2300 190"
            stroke="url(#soundwave-grad-1)"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />

          {/* Low-frequency bass soundwave */}
          <path
            d="M -100 360 Q 300 480, 750 340 T 1500 420 T 2200 320"
            stroke="url(#soundwave-grad-2)"
            strokeWidth="1.5"
          />

          {/* Secondary ambient vibration wave */}
          <path
            d="M -100 680 Q 400 580, 900 700 T 1800 640 T 2400 720"
            stroke="url(#soundwave-grad-1)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.7"
          />

          {/* Lower resonance contour */}
          <path
            d="M -100 1150 Q 500 1300, 1050 1120 T 1950 1220 T 2500 1140"
            stroke="url(#soundwave-grad-2)"
            strokeWidth="1.2"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  )
}
