import { CreditCard, Repeat, Workflow, Zap } from "lucide-react"

export const UseCaseCommerceFlowSection = () => {
    return (
        <section className="border-b border-border/40 px-6 py-32 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-[90rem]">
                <div className="mb-20 max-w-3xl">
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Payment flow
                    </p>

                    <h2 className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-tight">
                        Turn payments into
                        <br />
                        operational infrastructure.
                    </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {[
                        {
                            icon: CreditCard,
                            title: "Create checkout",
                            description:
                                "Generate Lightning payment pages via UI or API.",
                        },
                        {
                            icon: Zap,
                            title: "Receive payment",
                            description:
                                "Funds settle instantly to your wallet.",
                        },
                        {
                            icon: Workflow,
                            title: "Trigger automation",
                            description:
                                "Execute webhooks, API access, or delivery flows.",
                        },
                        {
                            icon: Repeat,
                            title: "Drive retention",
                            description:
                                "Reward customers and create repeat revenue loops.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-700 hover:border-border/80 hover:shadow-lg md:p-10`}
                        >
                            <div className="pointer-events-none absolute -right-6 -top-6 font-serif text-[8rem] font-bold leading-none text-primary/5">
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            <div className="relative flex gap-5">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg p-3 rounded-full text-primary bg-primary/10`}>
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold tracking-tight text-card-foreground md:text-xl">{item.title}</h3>
                                    <p className="mt-3 max-w-md text-[15px] leading-[1.7] text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
