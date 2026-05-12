import { Bot, KeyRound, Lock, Network, ShieldCheck, Wallet, Webhook, Zap } from "lucide-react";

export function ProtocolWhyLightningSection() {
    return (
        <section className="border-b border-white/10 px-6 py-20 sm:px-10 lg:px-16 bg-slate-50">
            <div className="mx-auto max-w-[90rem] flex flex-col">
                <div className="max-w-3xl">
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Why Lightning
                    </p>

                    <h2 className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-tight">
                        Commerce needs instant,
                        <br />
                        programmable settlement.
                    </h2>
                </div>

                <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            icon: Zap,
                            title: "Instant settlement",
                            description:
                                "Payments finalize globally in seconds.",
                        },
                        {
                            icon: Wallet,
                            title: "Self-custodial",
                            description:
                                "Merchants and agents control their own wallets.",
                        },
                        {
                            icon: Network,
                            title: "Internet-native",
                            description:
                                "No banking intermediaries or platform lock-in.",
                        },
                        {
                            icon: Bot,
                            title: "Machine payments",
                            description:
                                "Enable APIs, agents, and autonomous payment flows.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-border/60 bg-white p-8"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>

                            <h3 className="mt-8 text-xl font-semibold">
                                {item.title}
                            </h3>

                            <p className="mt-4 text-[15px] leading-[1.8] text-zinc-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center my-20 max-w-2xl mx-auto flex flex-col gap-2">
                    <p className="text-2xl font-semibold text-primary">Built for the next generation of internet commerce.</p>
                    <p className="text-lg">Lightning and L402 enable APIs, AI agents, and autonomous
                        applications to request services, settle payments,
                        and unlock access programmatically.</p>
                </div>

                <div className="flex justify-center">
                    <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-primary/[0.04] p-8 md:w-1/2">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-5">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                                    L402 support
                                </p>

                                <h3 className="mt-2 text-2xl font-semibold text-black">
                                    Payment-gated API access
                                </h3>
                            </div>

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                <KeyRound className="h-6 w-6 text-primary" />
                            </div>
                        </div>


                        <div className="mt-10 flex flex-col gap-5">
                            {[
                                {
                                    icon: Bot,
                                    title: "Agent requests API access",
                                },
                                {
                                    icon: Lock,
                                    title: "API returns Lightning invoice",
                                },
                                {
                                    icon: Wallet,
                                    title: "Agent wallet settles payment",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "L402 token grants access",
                                },
                                {
                                    icon: Webhook,
                                    title: "Service executes automatically",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center bg-white rounded-lg shadow gap-5 py-2"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center">
                                        <item.icon className="h-5 w-5 text-primary" />
                                    </div>

                                    <div className="flex-1 ">
                                        <div className="flex items-center">
                                            <span className="font-medium text-black">
                                                {item.title}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}