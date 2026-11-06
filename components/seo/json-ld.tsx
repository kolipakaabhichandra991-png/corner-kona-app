import React from 'react'
import { brand } from '@/config/brand'
import type { Episode, Story, Short } from '@/lib/content/types'
import type { Locale } from '@/lib/i18n'

export function ArticleJsonLd({ story, locale, url }: { story: Story; locale: Locale; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: story.title[locale],
    description: story.dek[locale],
    image: [story.image || `${brand.url}/placeholder.svg`],
    datePublished: story.publishedAt,
    dateModified: story.publishedAt,
    inLanguage: locale === 'hi' ? 'hi-IN' : 'en-US',
    author: {
      '@type': 'Organization',
      name: 'Corner Kona Editorial Team',
      url: brand.url,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Corner Kona',
      url: brand.url,
      logo: {
        '@type': 'ImageObject',
        url: `${brand.url}/brand/logo.svg`,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function PodcastJsonLd({ episode, locale, url }: { episode: Episode; locale: Locale; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title[locale],
    description: episode.title[locale],
    url: url,
    datePublished: episode.publishedAt,
    timeRequired: `PT${episode.durationMin}M`,
    image: episode.image || `${brand.url}/placeholder.svg`,
    inLanguage: episode.language === 'hi' ? 'hi-IN' : 'en-US',
    partOfSeries: {
      '@type': 'PodcastSeries',
      name: episode.show[locale],
      url: `${brand.url}/${locale}/podcasts`,
    },
    partOfSeason: episode.seasonNumber ? {
      '@type': 'PodcastSeason',
      seasonNumber: episode.seasonNumber,
    } : undefined,
    episodeNumber: episode.episodeNumber,
    isAccessibleForFree: !episode.premium,
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Corner Kona',
      url: brand.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function VideoJsonLd({ short, locale, url }: { short: Short; locale: Locale; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: short.title[locale],
    description: short.title[locale],
    thumbnailUrl: [short.image || `${brand.url}/placeholder.svg`],
    uploadDate: new Date().toISOString(),
    duration: `PT${short.durationSec}S`,
    contentUrl: url,
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Corner Kona',
      url: brand.url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteJsonLd({ locale }: { locale: Locale }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${brand.url}/#website`,
        url: brand.url,
        name: 'Corner Kona',
        description:
          locale === 'hi'
            ? 'कॉर्नर कोना — पॉडकास्ट, ऑडियोबुक्स, वीडियो और विचारशील पत्रकारिता का मंच'
            : 'Corner Kona — Multimedia storytelling ecosystem for podcasts, audiobooks, and journalism',
        inLanguage: ['hi-IN', 'en-US'],
        publisher: {
          '@id': `${brand.url}/#organization`,
        },
      },
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${brand.url}/#organization`,
        name: 'Corner Kona',
        url: brand.url,
        logo: {
          '@type': 'ImageObject',
          url: `${brand.url}/brand/logo.svg`,
        },
        sameAs: [
          'https://youtube.com/@cornerkona',
          'https://instagram.com/cornerkona',
          'https://twitter.com/cornerkona',
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
