import { useRef } from 'react'
import { Code2, GitBranch, Zap, Database } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const features = [
  {
    icon: Zap,
    title: 'Payments as a programmable API primitive',
    description: 'Lightning invoices are your entry point into the system. Create payment requests via API and attach them to any workflow, service, or agent.',
  },
  {
    icon: Code2,
    title: 'Authentication built for cryptographic systems',
    description: 'NIP-98 based authentication enables signed requests and verifiable identity for Nostr-native and API-based workflows.',
  },
  {
    icon: Database,
    title: 'Turn payments into workflows',
    description: 'A Lightning payment can trigger any backend action: issue credits, update databases, call external APIs, trigger agent execution. Payments become execution signals, not just transactions.',
  },
  {
    icon: GitBranch,
    title: 'Built for agentic systems',
    description: 'Designed for AI agents and autonomous systems that both: initiate payments, respond to payment events, execute workflows based on settlement state.',
  },
]

export function ForDevlopersSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="for-developers" className="relative border-t border-border/40 px-6 py-32 sm:px-10 md:py-40 lg:px-16">
      <div ref={ref} className="mx-auto max-w-[90rem]">
        {/* Header */}
        <div className={`mb-24 transition-all duration-1000 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="mb-5 font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase">
            For developers
          </p>
          <h2 className="max-w-3xl font-serif text-[clamp(2rem,4.5vw,3.75rem)] font-normal leading-[1.1] tracking-tight text-foreground">
            Payments as a primitive for your agents
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-[1.7] text-muted-foreground">
            Lightning invoices are your API entrance point. From there, orchestrate any workflow, trigger any agent, execute any contract.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {features.map((feature, i) => {
            const spans = ['lg:col-span-6', 'lg:col-span-6', 'lg:col-span-6', 'lg:col-span-6']
            return (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-700 hover:border-border/80 hover:shadow-lg md:p-10 ${spans[i]} ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ transitionDelay: isInView ? `${300 + i * 120}ms` : '0ms' }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary/12 group-hover:ring-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-card-foreground md:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-[1.7] text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div
          className={`mt-10 overflow-hidden rounded-2xl border border-border/40 bg-muted/30 p-8 transition-all duration-1000 delay-500 md:p-4 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        ><pre className="overflow-x-auto text-[13px] leading-relaxed text-muted-foreground/70">
            {`
// Lightning payments in a few lines of code

import { initializeWallet } from "@bitlasso/sdk"

const wallet = await initializeWallet({
  seed: {type: 'mnemonic', mnemonic: ''},
  breezApiKey: ''
})

const paymentRequest = await publishPaymentRequest(wallet, {
  items: [
    { title: "Consulting session", amount: 100 }
  ],
  discountRate: 10
})
            `}
          </pre>
        </div>
      </div>
    </section>
  )
}
