"use client"

import {
    ArrowRight,
    Zap,
    Bot,
    Webhook,
    CheckCircle2,
} from "lucide-react"
import { Link } from "react-router"

export function DeveloperHeroSection() {
    return (
        <section className="relative min-h-[100svh] overflow-hidden border-b border-white/10">
            <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[90rem] flex-col justify-center px-6 py-28 sm:px-10 lg:px-16">
                <div className="grid items-center gap-20 lg:grid-cols-[1.1fr_0.9fr]">

                    {/* LEFT */}
                    <div>
                        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                            Developers
                        </p>

                        <h1 className="max-w-5xl font-serif text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-tight">
                            Programmable Lightning payments
                            <br />
                            for apps and agents.
                        </h1>

                        <p className="mt-8 max-w-2xl text-lg leading-[1.9] text-zinc-400">
                            Allow AI systems and autonomous agents to generate invoices,
                            receive Lightning payments instantly, and automate service delivery
                            with self-custodial wallets.
                        </p>

                        {/* CTA */}
                        <div className="mt-12 flex flex-wrap gap-4">
                            <Link
                                to="/app"
                                className="flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-[15px] font-medium text-background transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 "
                            >
                                Create your checkout
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Mini metrics */}
                        <div className="mt-14 flex flex-wrap gap-8">
                            {[
                                "Instant settlement",
                                "Agent-owned wallets",
                                "Webhook automation",
                                "Lightning-native",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-2 text-sm text-zinc-400"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative flex items-center justify-center">

                        {/* Main terminal / flow card */}
                        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-black/5 shadow-2xl backdrop-blur-xl">

                            {/* Top bar */}
                            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                            </div>

                            {/* Flow */}
                            <div className="space-y-6 p-6">

                                {/* Step */}
                                <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-white p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            AI agent creates invoice
                                        </p>

                                        <p className="mt-1 text-sm leading-[1.8] text-zinc-400">
                                            Generate Lightning invoices programmatically
                                            for APIs, subscriptions, or autonomous services.
                                        </p>
                                    </div>
                                </div>

                                {/* Connector */}
                                <div className="flex justify-center">
                                    <div className="h-10 w-px bg-primary/20" />
                                </div>

                                {/* Step */}
                                <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-white p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                        <Zap className="h-5 w-5 text-primary" />
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Lightning payment settles instantly
                                        </p>

                                        <p className="mt-1 text-sm leading-[1.8] text-zinc-400">
                                            Funds arrive directly into the agent’s wallet
                                            without custodial intermediaries.
                                        </p>
                                    </div>
                                </div>

                                {/* Connector */}
                                <div className="flex justify-center">
                                    <div className="h-10 w-px bg-primary/20" />
                                </div>

                                {/* Step */}
                                <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-white p-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                        <Webhook className="h-5 w-5 text-primary" />
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            Service executes automatically
                                        </p>

                                        <p className="mt-1 text-sm leading-[1.8] text-zinc-400">
                                            Trigger webhooks, API access, content delivery,
                                            or autonomous workflows after settlement.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}