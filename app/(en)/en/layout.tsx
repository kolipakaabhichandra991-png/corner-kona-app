import './../../globals.css'
import { RootShell } from '@/components/layout/root-shell'
import { siteMetadata, siteViewport } from '@/lib/seo'

export const metadata = siteMetadata('en')
export const viewport = siteViewport

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>
}
