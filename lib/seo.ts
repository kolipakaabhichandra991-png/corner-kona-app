import type { Metadata, Viewport } from 'next'
import { brand } from '@/config/brand'
import type { Locale } from '@/lib/i18n'

export const siteViewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: brand.palette.light.background },
    { media: '(prefers-color-scheme: dark)', color: brand.palette.dark.background },
  ],
}

export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description, image }: { title: string; description?: string; image?: string },
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: locale === 'en' ? `/en${path}` : path,
      languages: { 'hi-IN': path, 'en-IN': `/en${path}`, 'x-default': path },
    },
    openGraph: { title, description, images: image ? [image] : undefined },
  }
}

export function siteMetadata(locale: Locale): Metadata {
  const title = `${brand.name} — ${brand.tagline[locale]}`
  const description =
    locale === 'hi'
      ? 'पॉडकास्ट, ऑडियोबुक, शॉर्ट वीडियो और कहानियाँ — खेल, मनोरंजन, भू-राजनीति, भक्ति और लाइफ़स्टाइल।'
      : 'Podcasts, audiobooks, short videos and stories — sports, entertainment, geopolitics, bhakti and lifestyle.'
  return {
    metadataBase: new URL(brand.url),
    title: { default: title, template: `%s · ${brand.name}` },
    description,
    alternates: {
      canonical: locale === 'en' ? '/en' : '/',
      languages: { 'hi-IN': '/', 'en-IN': '/en', 'x-default': '/' },
    },
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title,
      description,
      locale: locale === 'en' ? 'en_IN' : 'hi_IN',
      images: ['/images/hero-podcast.png'],
    },
    twitter: { card: 'summary_large_image', title, description },
    icons: {
      icon: [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}
