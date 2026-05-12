import { Bot, Globe, Server, ShoppingBag, Sparkles, Users } from "lucide-react"

const useCases = [
  {
    icon: Bot,
    title: "AI Agents",
    description:
      "Allow autonomous agents to create invoices, receive Lightning payments, and automate service execution.",
    bullets: [
      "Agent-owned wallets",
      "Autonomous invoicing",
      "Machine-to-machine payments",
    ],
  },
  {
    icon: Server,
    title: "APIs & SaaS",
    description:
      "Monetize APIs with Lightning-native payment flows and usage-based access.",
    bullets: [
      "Pay-per-call APIs",
      "L402-compatible flows",
      "Webhook execution",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Digital Products",
    description:
      "Sell files, subscriptions, and digital services with instant Bitcoin settlement.",
    bullets: [
      "Instant checkout",
      "Self-custodial revenue",
      "Retention incentives",
    ],
  },
  {
    icon: Users,
    title: "Communities",
    description:
      "Reward members with discounts, credits, and recurring engagement loops.",
    bullets: [
      "Member rewards",
      "Retention mechanics",
      "Community incentives",
    ],
  },
  {
    icon: Sparkles,
    title: "Creators",
    description:
      "Accept direct Lightning payments without platform taxes or intermediaries.",
    bullets: [
      "Direct monetization",
      "Audience ownership",
      "Global payments",
    ],
  },
  {
    icon: Globe,
    title: "Global Commerce",
    description:
      "Receive borderless Bitcoin payments instantly with Lightning-native infrastructure.",
    bullets: [
      "Instant settlement",
      "Low fees",
      "Worldwide reach",
    ],
  },
]

export const UseCaseGridSection = () => {
  return (
    <section className="border-b border-border/40 bg-slate-50 px-6 py-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-20 max-w-3xl">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
            Who it’s for
          </p>

          <h2 className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-tight">
            One payment layer.
            <br />
            Multiple business models.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {useCases.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-border/40 bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>

              <h3 className="mt-8 text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>

              <p className="mt-4 text-[15px] leading-[1.8] text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {item.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-foreground/80">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}