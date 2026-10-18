import './../globals.css'
import { RootShell } from '@/components/layout/root-shell'
import { siteMetadata, siteViewport } from '@/lib/seo'

export const metadata = siteMetadata('hi')
export const viewport = siteViewport

export default function HindiRootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="hi">{children}</RootShell>
}
