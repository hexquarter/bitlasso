import { Navbar } from '@/components/landing/navbar.tsx'
import { DeveloperHeroSection } from '@/components/landing/developers/hero'
import { Footer } from '@/components/landing/footer'
import { DeveloperCodeSection } from '@/components/landing/developers/code-section'
import { DeveloperUseCaseSection } from '@/components/landing/developers/use-case-section'
import { DeveloperWhyBitlassoSection } from '@/components/landing/developers/why-bitlasso-section'
import { DeveloperCtaSection } from '@/components/landing/developers/cta-section'

export const DeveloperPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DeveloperHeroSection />
      <DeveloperCodeSection />
      <DeveloperUseCaseSection />
      <DeveloperWhyBitlassoSection />
      <DeveloperCtaSection />
      <Footer />
    </main>
  )
}