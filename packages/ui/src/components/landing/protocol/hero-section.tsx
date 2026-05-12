import { Globe, Workflow, Zap } from "lucide-react";

export function ProtocolHeroSection() {
    return (
        <section className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />

            <div className="relative z-10 mx-auto flex min-h-[90svh] max-w-[90rem] flex-col justify-center px-6 py-32 sm:px-10 lg:px-16">
                <div className="max-w-5xl">
                    <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Protocol
                    </p>

                    <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight">
                        Open infrastructure
                        <br />
                        for programmable commerce.
                    </h1>

                    <p className="mt-8 max-w-3xl text-lg leading-[1.9] text-zinc-400">
                        Bitlasso combines Lightning payments and Nostr-based verification
                        to create self-custodial, portable, and programmable commerce
                        infrastructure.
                    </p>
                </div>

                {/* Architecture visual */}
                <div className="mt-24 flex gap-10">
                    {[
                        {
                            title: "Lightning",
                            subtitle: "Payments",
                            icon: Zap,
                        },
                        {
                            title: "Nostr",
                            subtitle: "Verification & metadata",
                            icon: Globe,
                        },
                        {
                            title: "Bitlasso",
                            subtitle: "Commerce automation",
                            icon: Workflow,
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                            <item.icon className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{item.title}
                                <span className="font-normal">{" "} for {item.subtitle}</span></span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}