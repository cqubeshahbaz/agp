import { ApplicationLayout } from '@/app/(shop)/application-layout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ApplicationLayout>{children}</ApplicationLayout>
}