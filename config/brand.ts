/**
 * Single swap point for brand identity. Replace the placeholder name,
 * wordmark and palette here; every component reads from these tokens.
 */
export const brand = {
  name: 'Corner Kona',
  shortName: 'Kona',
  wordmark: { primary: 'CORNER', secondary: 'KONA' },
  tagline: {
    hi: 'कहानियाँ जो सुनी, देखी और महसूस की जाती हैं',
    en: 'Stories you hear, watch and feel',
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cornerkona.com',
  social: {
    youtube: 'https://youtube.com/@cornerkona',
    instagram: 'https://instagram.com/cornerkona',
    x: 'https://x.com/cornerkona',
  },
  palette: {
    light: {
      background: '#F5F4F0',
      surface: '#FFFFFF',
      foreground: '#14161C',
      muted: '#E9E7E1',
      mutedForeground: '#5C5F68',
      border: '#DCD9D1',
      primary: '#9333EA',
      primaryForeground: '#FFFFFF',
      ink: '#14161C',
      inkForeground: '#F5F4F0',
    },
    dark: {
      background: '#0E1015',
      surface: '#171A21',
      foreground: '#F1F0EC',
      muted: '#22262F',
      mutedForeground: '#A2A5AE',
      border: '#2A2E38',
      primary: '#A855F7',
      primaryForeground: '#FFFFFF',
      ink: '#F1F0EC',
      inkForeground: '#0E1015',
    },
  },
  sections: {
    sports: '#FF4D2E',
    entertainment: '#FF3D8B',
    geopolitics: '#5B86FF',
    bhakti: '#F29A2E',
    lifestyle: '#14B386',
    antarYatra: '#F29A2E',
    english: '#5B86FF',
    live: '#FF2E2E',
  },
} as const

export type SectionKey = keyof typeof brand.sections

type Palette = Record<keyof (typeof brand.palette)['light'], string>

const toVars = (p: Palette) =>
  [
    `--background:${p.background}`,
    `--foreground:${p.foreground}`,
    `--card:${p.surface}`,
    `--card-foreground:${p.foreground}`,
    `--popover:${p.surface}`,
    `--popover-foreground:${p.foreground}`,
    `--primary:${p.primary}`,
    `--primary-foreground:${p.primaryForeground}`,
    `--secondary:${p.muted}`,
    `--secondary-foreground:${p.foreground}`,
    `--muted:${p.muted}`,
    `--muted-foreground:${p.mutedForeground}`,
    `--accent:${p.muted}`,
    `--accent-foreground:${p.foreground}`,
    `--border:${p.border}`,
    `--input:${p.border}`,
    `--ring:${p.primary}`,
    `--ink:${p.ink}`,
    `--ink-foreground:${p.inkForeground}`,
  ].join(';')

const sectionVars = Object.entries(brand.sections)
  .map(([k, v]) => `--section-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
  .join(';')

export const brandCss = `:root{${toVars(brand.palette.light)};${sectionVars}}.dark{${toVars(brand.palette.dark)}}`
