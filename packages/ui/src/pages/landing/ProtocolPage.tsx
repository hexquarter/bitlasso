import { Navbar } from '@/components/landing/navbar.tsx'
import { Footer } from '@/components/landing/footer'
import { ProtocolHeroSection } from '@/components/landing/protocol/hero-section'
import { ProtocolWhyLightningSection } from '@/components/landing/protocol/why-lightning'
import { ProtocolProgrammablePaymentsSection } from '@/components/landing/protocol/programmable-section'
import { ProtocolWhyNostrSection } from '@/components/landing/protocol/why-nostr'
import { ProtocolCTASection } from '@/components/landing/protocol/cta'

export const ProtocolPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ProtocolHeroSection />
      <ProtocolWhyLightningSection />
      <ProtocolWhyNostrSection />
      <ProtocolProgrammablePaymentsSection />
      <ProtocolCTASection />
      <Footer />
    </main>
  )
}