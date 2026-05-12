import { Navbar } from '@/components/landing/navbar.tsx'
import { Footer } from '@/components/landing/footer'
import { UseCaseHeroSection } from '@/components/landing/usecases/hero-section'
import { UseCaseGridSection } from '@/components/landing/usecases/grid-section'
import { UseCaseCommerceFlowSection } from '@/components/landing/usecases/commercial-flow-section'
import { UseCaseBenefitsSection } from '@/components/landing/usecases/benefits-section'
import { UseCaseCTASection } from '@/components/landing/usecases/cta-section'

export const UsecasePage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <UseCaseHeroSection />
      <UseCaseGridSection />
      <UseCaseCommerceFlowSection />
      <UseCaseBenefitsSection />
      <UseCaseCTASection />
      <Footer />
    </main>
  )
}