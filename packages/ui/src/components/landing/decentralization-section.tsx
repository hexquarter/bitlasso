"use client"

import { useRef } from "react"
import { Network, Users, Zap, Share2 } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const benefits = [
  {
    icon: Network,
    title: "Open coordination layer",
    description:
      "Your business does not rely on a single company staying online, operating infrastructure, or maintaining access to your data. Nostr enables open communication between merchants, clients, agents, and services without centralized intermediaries.",
  },
  {
    icon: Users,
    title: "Portable merchant identity",
    description:
      "Your merchant profile, payment metadata, and reputation are portable across any Nostr-enabled application. No regional banking rails, account restrictions, or geographic limitations. Lightning + Nostr works anywhere internet access exists.",
  },
  {
    icon: Zap,
    title: "Built for machine-native systems",
    description:
      "Agents and automated services can authenticate, communicate, and coordinate payments using open cryptographic standards.",
  },
  {
    icon: Share2,
    title: "Your data stays yours",
    description:
      "Transaction metadata, customer relationships, and operational history remain exportable and under merchant control.",
  },
]

export function DecentralizationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="decentralized" className="relative border-t border-border/40 px-6 py-32 sm:px-10 md:py-40 lg:px-16">
      <div ref={ref} className="mx-auto max-w-[90rem]">
        {/* Header */}
        <div className={`mb-24 transition-all duration-1000 ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <p className="mb-5 font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase">Decentralized</p>
          <h2 className="max-w-4xl font-serif text-[clamp(2rem,4.5vw,3.75rem)] font-normal leading-[1.1] tracking-tight text-foreground">
            Built on Nostr for portable commerce
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-[1.7] text-muted-foreground">
            Bitlasso uses Nostr as its coordination and identity layer — an open protocol where merchants own their identity, payment history, and client relationships.
            No platform lock-in. No proprietary network effects.
          </p>
        </div>

        {/* 2x2 feature grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-700 hover:border-border/80 hover:shadow-lg md:p-10 ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: isInView ? `${400 + i * 100}ms` : "0ms" }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary/12 group-hover:ring-primary/20">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-card-foreground md:text-xl">{benefit.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div
          className={`mt-20 flex flex-col gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-12 transition-all duration-1000 delay-500 ${isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <p>Why Nostr?</p>
          <p className="text-[15px] leading-[1.8] text-foreground/80"> Nostr is an open protocol for identity and communication.</p>
          <p className="text-[15px] leading-[1.8] text-foreground/80"> Like Bitcoin removes centralized control from money, Nostr removes centralized control from identity, coordination, and relationships. </p>
          <p className="text-[15px] leading-[1.8] text-foreground/80"> Bitlasso uses Nostr so merchants can: </p>
          <ul className="list-disc ml-10 text-[15px] leading-[1.8] text-foreground/80">
            <li>own their business identity</li>
            <li>move across tools freely</li>
            <li>integrate with open ecosystems</li>
            <li>avoid platform lock-in</li>
          </ul>
        </div>
      </div>
    </section >
  )
}
