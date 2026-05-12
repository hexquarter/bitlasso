"use client"

import {
    Database,
    ShieldCheck,
    Radio,
    KeyRound,
    ArrowRight,
    Receipt,
    Wallet,
    CheckCircle2,
    Globe,
    Workflow,
    Zap,
} from "lucide-react"

export function ProtocolWhyNostrSection() {
    return (
        <section className="relative overflow-hidden border-t border-border/40 px-6 py-32 sm:px-10 lg:px-16">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />

            <div className="relative z-10 mx-auto max-w-[90rem]">
                {/* HEADER */}
                <div className="max-w-4xl">
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Why Nostr
                    </p>

                    <h2 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-tight">
                        Bitcoin apps should live
                        <br />
                        inside open platforms.
                    </h2>

                    <p className="mt-8 max-w-2xl text-lg leading-[1.9] text-muted-foreground">
                        Bitlasso uses Nostr as an open coordination and storage layer
                        for payment requests, settlement metadata, rewards,
                        and portable merchant data.
                    </p>
                </div>

                {/* VALUE GRID */}
                <div className="mt-24 grid gap-4 lg:grid-cols-3">
                    {[
                        {
                            icon: Database,
                            title: "Decentralized",
                            description:
                                "Checkout metadata and payment events are stored across multiple relays for portability, redundancy, and transparency.",
                        },
                        {
                            icon: ShieldCheck,
                            title: "Open verification",
                            description:
                                "Invoices, settlements, rewards, and pricing events can be cryptographically verified across applications.",
                        },
                        {
                            icon: Workflow,
                            title: "Ease of coordination",
                            description:
                                "Signed events synchronize merchants, wallets, applications, and automation flows without centralized dependencies.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-white/10 bg-white p-8 backdrop-blur-sm"
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>

                            <h3 className="text-xl font-semibold tracking-tight ">
                                {item.title}
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.9] text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* MAIN FLOW VISUAL */}
                <div className="mt-32 shadow bg-primary/5 p-10 rounded-lg">
                    <div className="mb-10 flex items-center gap-6">
                        <div className="h-px flex-1 bg-white/10" />

                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                            Payment coordination flow
                        </p>

                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-5">
                        {/* STEP 1 */}
                        <div className="relative overflow-hidden rounded-3xl border border-primary/10 p-8 bg-white">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <KeyRound className="h-6 w-6 text-primary" />
                            </div>

                            <div className="mb-6 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] ">
                                Step 01
                            </div>

                            <h3 className="text-xl font-semibold">
                                Merchant connects
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.8] ">
                                Login with Nostr keys or passphrase-based accounts.
                            </p>

                            <div className="mt-8 rounded-2xl border border-white/10 p-4">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Radio className="h-4 w-4 text-primary" />
                                    Identity linked to open protocols
                                </div>
                            </div>
                        </div>

                        {/* STEP 2 */}
                        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-8">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <Database className="h-6 w-6 text-primary" />
                            </div>

                            <div className="mb-6 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em]">
                                Step 02
                            </div>

                            <h3 className="text-xl font-semibold">
                                Settings sync
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.8]">
                                Merchant configuration and preferences load from Nostr relays.
                            </p>

                            <div className="mt-8 space-y-2 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                                {[
                                    "Business settings",
                                    "Reward configuration"
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* STEP 3 */}
                        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/[0.08] p-8 shadow-[0_0_80px_rgba(255,255,255,0.03)]">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                                <Receipt className="h-6 w-6 text-primary" />
                            </div>

                            <div className="mb-6 inline-flex rounded-full border border-primary/20 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-primary">
                                Step 03
                            </div>

                            <h3 className="text-xl font-semibold">
                                Checkout creation
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.8] text-muted-foreground">
                                Bitlasso publishes signed checkout events containing payment metadata.
                            </p>

                            <div className="mt-8 rounded-2xl border border-primary/10 bg-primary/20 p-4">
                                <p className="font-mono text-xs leading-[1.8] text-foreground/80">
                                    pubkey <br />
                                    items[]<br />
                                    discounts<br />
                                </p>
                            </div>
                        </div>

                        {/* STEP 4 */}
                        <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-8">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>

                            <div className="mb-6 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em]">
                                Step 04
                            </div>

                            <h3 className="text-xl font-semibold">
                                Lightning settlement
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.8] text-muted-foreground ">
                                Payments settle instantly while settlement events are published and verified.
                            </p>

                            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/5 p-4">
                                <Zap className="h-5 w-5 text-primary" />

                                <div className="flex flex-col gap-2">
                                    <span className="text-sm font-medium">
                                        Lightning invoice paid
                                    </span>

                                    <span className="text-xs text-muted-foreground">
                                        Settlement broadcast to relays
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* STEP 5 */}
                        <div className="relative overflow-hidden rounded-3xl border border-primary/10 p-8 bg-white">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>

                            <div className="mb-6 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em]">
                                Step 05
                            </div>

                            <h3 className="text-xl font-semibold">
                                Portable commerce
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.8]">
                                Rewards, credits, and payment history remain portable across devices and applications.
                            </p>

                            <div className="mt-8 flex items-center gap-3">
                                <ArrowRight className="h-4 w-4 text-primary" />

                                <span className="text-sm text-muted-foreground">
                                    Open ecosystem interoperability
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER NOTE */}
                <div className="mt-10 flex justify-center">
                    <div className="inline-flex items-center gap-3 rounded-full bg-white p-3 rounded border border-primary/10">
                        <Radio className="h-4 w-4 text-primary" />

                        <p className="text-sm">
                            Open protocols instead of closed platforms.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}