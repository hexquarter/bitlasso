"use client"

import {
  ShieldCheck,
  Coins,
  Workflow,
  Zap,
  Ban,
  User,
  Percent,
  TrendingUp,
  Bitcoin,
  BarChart3,
  Tag,
  Radio,
} from "lucide-react"

export function OperationalSection() {

  return (
    <section
      id="real-tokens"
      className="relative overflow-hidden border-t border-border/40 bg-slate-50 px-6 py-32 sm:px-10 md:py-40 lg:px-16"
    >
      <div className="mx-auto max-w-[90rem]">
        {/* Top heading */}
        <div className="">
          <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
            Loop of Work
          </p>

          <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight text-foreground">
            Payments in.
            Value out.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-[1.8] text-muted-foreground">
            A closed-loop Lightning payment system that rewards real work,
            enables repeat transactions, and creates programmable operational value.
          </p>
        </div>

        {/* Main visual */}
        <div className="flex flex-col lg:flex-row gap-10 mx-auto mt-24 bg-white p-10 rounded-xl shadow-lg">

          {/* Side labels */}
          <div className="flex flex-col gap-10">

            <div className="flex gap-5">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Customer Payment
                </h3>

                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Clients pay instantly over Lightning and receive operational value.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Token Usage
                </h3>

                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Tokens unlock discounts, credits, and future payment redemption.
                </p>
              </div>
            </div>



            <div className="flex gap-5">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Earned value
                </h3>

                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Completed work and utility create natural scarcity over time.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Bitcoin className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Bitcoin Treasury
                </h3>

                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Merchants retain Bitcoin directly and build treasury over time.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Operational Value
                </h3>

                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  Payment activity creates incentives for repeat transactions and long-term engagement.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Percent className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Increased Discounts
                </h3>

                <p className="text-[15px] leading-[1.8] text-muted-foreground">
                  More activity unlocks stronger incentives and retention loops.
                </p>
              </div>
            </div>
          </div>

          {/* CENTER VISUAL */}
          <div className="relative flex flex-col md:flex-row items-center justify-center py-10">

            {/* LEFT CIRCLE */}
            <div className="relative h-[20rem] w-[20rem] rounded-full bg-primary">

              {/* Ring */}
              <div className="absolute inset-6 rounded-full border bg-white/90" />

              {/* Center */}
              <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border/40 bg-background shadow-sm">
                <Coins className="mb-4 h-10 w-10 text-primary" />

                <p className="font-mono text-sm uppercase tracking-[0.2em] text-foreground">
                  Payments
                </p>
              </div>

            
            </div>

            {/* RIGHT CIRCLE */}
            <div className="relative -ml-10 h-[20rem] w-[20rem] rounded-full bg-black">

              {/* Ring */}
              <div className="absolute inset-6 rounded-full border border-border/30 bg-white/90" />

              {/* Center */}
              <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-border/40 bg-white shadow-sm">
                <ShieldCheck className="mb-4 h-10 w-10 text-primary" />

                <p className="font-mono text-sm uppercase tracking-[0.2em] text-foreground">
                  Receipts
                </p>
              </div>

              
            </div>


          </div>

        </div>

        {/* Bottom grid */}
        <div className="mt-24 flex flex-col p-2 rounded-3xl border border-border/40 bg-border/20 bg-white p-10 gap-5">
          <p className="text-primary uppercase text-lg tracking-widest text-center font-mono">Built for real world use</p>
          <div className="grid gap-px overflow-hidden md:grid-cols-2 lg:grid-cols-5">

            {[
              {
                title: "Operational Receipts",
                description:
                  "Proof of work, value, and payment completion.",
                icon: ShieldCheck,
              },
              {
                title: "Merchant Controlled",
                description:
                  "Issuance and redemption logic stay fully configurable.",
                icon: User,
              },
              {
                title: "Automation Ready",
                description:
                  "Trigger workflows, credits, and backend actions.",
                icon: Workflow,
              },
              {
                title: "Powered by Lightning",
                description:
                  "Issued directly from Lightning payment events.",
                icon: Zap,
              },
              {
                title: "Nostr anchoring",
                description:
                  "Metadata published on Nostr providing verifiable provenance.",
                icon: Radio,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 border-r border-border/40 last:border-0"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>

                <h4 className="text-base font-semibold text-foreground">
                  {item.title}
                </h4>

                <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-14 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full  bg-primary/5 px-6 py-3">
            <Ban className="h-4 w-4 text-primary" />

            <p className="text-sm text-muted-foreground">
              Not trading. Not speculation.
              <span className="ml-1 font-medium text-primary">
                Purely operational.
              </span>
            </p>
          </div>
        </div>
      </div>

    </section >
  )
}