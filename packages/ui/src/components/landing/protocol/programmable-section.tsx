"use client"

import {
    ArrowRight,
    Bot,
    CheckCircle2,
    Coins,
    Receipt,
    Sparkles,
    Webhook,
} from "lucide-react"

export function ProtocolProgrammablePaymentsSection() {
    return (
        <section className="relative overflow-hidden border-b border-white/10 px-6 py-32 sm:px-10 lg:px-16 bg-slate-50">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]" />

            <div className="relative z-10 mx-auto max-w-[90rem]">
                <div className="grid items-center gap-24 lg:grid-cols-[0.9fr_1.1fr]">
                    {/* LEFT CONTENT */}
                    <div>
                        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                            Programmable payments
                        </p>

                        <h2 className="font-serif text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-tight">
                            Payments should
                            <br />
                            trigger actions.
                        </h2>

                        <p className="mt-8 max-w-xl text-lg leading-[1.9] text-muted-foreground">
                            Lightning invoices become programmable execution layers
                            for APIs, automation, agents, and service delivery.
                        </p>

                        {/* Feature pills */}
                        <div className="mt-10 flex flex-wrap gap-3">
                            {[
                                "Webhook delivery",
                                "AI agent billing",
                                "API monetization",
                                "Usage-based flows",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm text-primary"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>

                        {/* Quote / positioning */}
                        <div className="mt-14 rounded-3xl border border-primary/10 bg-white p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center p-2 rounded-2xl bg-primary/10">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Toward machine-native commerce
                                    </p>

                                    <p className="mt-3 text-[15px] leading-[1.9] text-zinc-400">
                                        AI agents, APIs, and autonomous services
                                        require payment systems that can execute
                                        logic automatically.
                                        <span className="text-primary">
                                            {" "}
                                            Bitlasso is built for that environment.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white p-8 backdrop-blur-xl">
                            {/* Top row */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                                <div>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                                        Execution flow
                                    </p>

                                    <h3 className="mt-3 text-2xl">
                                        Lightning-driven automation
                                    </h3>
                                </div>
                            </div>

                            {/* Flow Steps */}
                            <div className="relative mt-10 space-y-6">
                                {/* Vertical line */}
                                <div className="absolute left-5 top-4 h-[85%] w-px bg-gradient-to-b from-primary/40 to-transparent" />

                                {[
                                    {
                                        icon: Receipt,
                                        title: "Invoice created",
                                        description:
                                            "An app or AI agent generates a Lightning invoice.",
                                    },
                                    {
                                        icon: Coins,
                                        title: "Payment settles",
                                        description:
                                            "Bitcoin settles instantly through Lightning.",
                                    },
                                    {
                                        icon: Webhook,
                                        title: "Webhook triggered",
                                        description:
                                            "Settlement automatically executes backend logic.",
                                    },
                                    {
                                        icon: Sparkles,
                                        title: "Service delivered",
                                        description:
                                            "APIs unlock access, content, compute, or automation.",
                                    },
                                    {
                                        icon: CheckCircle2,
                                        title: "Rewards issued",
                                        description:
                                            "Customers receive credits, discounts, or future incentives.",
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={item.title}
                                        className="relative flex gap-5"
                                    >
                                        {/* Timeline node */}
                                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white">
                                            <item.icon className="h-4 w-4 text-primary" />
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 rounded-2xl border p-5 transition-all duration-300 border-primary/20">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">
                                                    {item.title}
                                                </h4>

                                                <span className="font-mono text-[11px] text-white/30">
                                                    0{i + 1}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-[15px] leading-[1.8] text-zinc-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom status */}
                            <div className="mt-10 flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/[0.04] px-5 py-4">
                                <div>
                                    <p className="text-sm font-medium text-primary">
                                        Machine-to-machine commerce ready
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-500">
                                        APIs • Agents • Automated services
                                    </p>
                                </div>

                                <ArrowRight className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}