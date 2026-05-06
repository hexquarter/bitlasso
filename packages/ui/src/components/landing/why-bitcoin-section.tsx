import { useRef } from "react"
import { Clock, Shield, Globe, Lock } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const reasons = [
  {
    icon: Clock,
    title: "Checkout speed that feels instant",
    description:
      "Lightning settles payments in seconds, making checkout feel immediate. On-chain Bitcoin is too slow and uncertain for real-time commerce.",
  },
  {
    icon: Lock,
    title: "Single-use invoices for clean checkout flows",
    description:
      "Each Lightning invoice is tied to one payment only. That makes checkout deterministic: no reuse, no ambiguity, no double-spend risk at the application layer.",
  },
  {
    icon: Shield,
    title: "No waiting for confirmations",
    description:
      "Bitcoin on-chain requires block confirmations and introduces UX friction. Lightning removes confirmation latency entirely for end-user payments.",
  },
  {
    icon: Globe,
    title: "Global payments without payment rail complexity",
    description:
      "Lightning abstracts away banking rails and regional fragmentation. One integration works everywhere without relying on card networks or bank settlement windows.",
  },
  {
    icon: Shield,
    title: "Bitcoin as settlement, Lightning as execution",
    description:
      "Bitcoin remains the base settlement layer for finality. Lightning is the execution layer optimized for high-frequency checkout flows—not a replacement, but the right layer for payments.",
  },
  {
    icon: Lock,
    title: "Built for machine-native checkout (L402-ready)",
    description:
      "Lightning enables programmable, API-native payments. Perfect for automated checkout flows, AI agents, and instant pay-per-request systems.",
  },
]

const comparison = {
  bitcoin: [
    "Minutes to hours settlement time",
    "Variable confirmation delays",
    "On-chain fees for every payment",
    "Poor UX for checkout flows",
    "Not optimized for high-frequency payments",
  ],
  lightning: [
    "Sub-second to few-second settlement",
    "Instant payment confirmation UX",
    "Low routing-based fees",
    "Optimized for checkout flows",
    "Designed for high-frequency transactions",
  ],
}

export function WhyLightningSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="why-lightning"
      className="relative border-t border-border/40 px-6 py-32 sm:px-10 md:py-40 lg:px-16 bg-slate-50"
    >
      <div ref={ref} className="mx-auto max-w-[90rem]">

        {/* Header */}
        <div
          className={`mb-24 transition-all duration-1000 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-5 font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase">
            Why Lightning
          </p>

          <h2 className="max-w-4xl font-serif text-[clamp(2rem,4.5vw,3.75rem)] font-normal leading-[1.1] tracking-tight text-black">
            Bitcoin scaled for instant, private payments
          </h2>
        </div>

        {/* Comparison */}
        <div
          className={`mb-20 overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-1000 delay-200 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid md:grid-cols-2">

            <div className="border-b border-border/40 p-8 md:border-r md:border-b-0 md:p-12">
              <p className="mb-8 font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
                Bitcoin (on-chain)
              </p>

              <div className="flex flex-col gap-5">
                {comparison.bitcoin.map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="h-px w-4 bg-muted-foreground/20" />
                    <span className="text-[15px] text-muted-foreground/70 line-through decoration-muted-foreground/20">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-12">
              <p className="mb-8 font-mono text-[10px] font-medium tracking-[0.2em] text-primary uppercase">
                Lightning checkout layer
              </p>

              <div className="flex flex-col gap-5">
                {comparison.lightning.map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-[15px] font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Feature cards */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-9 xl:grid-cols-12">
          {reasons.map((reason, i) => {
            const spans = [
              "lg:col-span-4",
              "lg:col-span-4",
              "lg:col-span-4",
              "lg:col-span-4",
              "lg:col-span-4",
              "lg:col-span-4",
            ]

            return (
              <div
                key={reason.title}
                className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-700 hover:border-border/80 hover:shadow-lg md:p-10 ${
                  spans[i]
                } ${
                  isInView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{
                  transitionDelay: isInView ? `${500 + i * 120}ms` : "0ms",
                }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
                  <reason.icon className="h-5 w-5 text-primary" />
                </div>

                <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                  {reason.title}
                </h3>

                <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}