import { MetadataRoute } from 'next'
import { brand } from '@/config/brand'
import { getCategories, getEpisodes, getStories } from '@/lib/content/repository'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, episodes, stories] = await Promise.all([
    getCategories(),
    getEpisodes({ premium: false }),
    getStories(),
  ])

  const baseUrl = brand.url
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/en`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/hi`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/podcasts`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/en/podcasts`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/videos`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/en/videos`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/antar-yatra`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/en/antar-yatra`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/en/stories`, lastModified: new Date(), priority: 0.9 },
  ]

  categories.forEach((cat) => {
    routes.push({ url: `${baseUrl}/${cat.slug}`, lastModified: new Date(), priority: 0.8 })
    routes.push({ url: `${baseUrl}/en/${cat.slug}`, lastModified: new Date(), priority: 0.8 })
  })

  episodes.forEach((ep) => {
    routes.push({ url: `${baseUrl}/podcasts/${ep.slug}`, lastModified: new Date(), priority: 0.7 })
    routes.push({ url: `${baseUrl}/en/podcasts/${ep.slug}`, lastModified: new Date(), priority: 0.7 })
  })

  stories.forEach((st) => {
    routes.push({ url: `${baseUrl}/stories/${st.slug}`, lastModified: new Date(), priority: 0.7 })
    routes.push({ url: `${baseUrl}/en/stories/${st.slug}`, lastModified: new Date(), priority: 0.7 })
  })

  return routes
}
