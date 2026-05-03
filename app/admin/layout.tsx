import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Blog Management',
  description: 'Admin panel for managing blog posts',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
