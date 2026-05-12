import { Navbar } from '@/components/landing/navbar.tsx'
import { HeroSection } from '@/components/landing/hero.tsx'
import { HowItWorksSection } from '@/components/landing/how-it-works-section.tsx'
import { PricingSection } from '@/components/landing/pricing-section.tsx'
import { CtaSection } from '@/components/landing/cta-section.tsx'
import { Footer } from '@/components/landing/footer.tsx'
import { WhyBitlassoSection } from '@/components/landing/why-bitlasso-section'

export const LandingPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <WhyBitlassoSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}