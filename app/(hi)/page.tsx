import { HomePage } from '@/components/home/home-page'

export const revalidate = 300

export default function Page() {
  return <HomePage locale="hi" />
}
