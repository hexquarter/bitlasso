import { Check, Layers3, Radio, ShieldCheck } from "lucide-react"

export const DeveloperWhyBitlassoSection = () => {
    return (
        <section className="border-b border-white/10 px-6 py-22 sm:px-10 lg:px-16 bg-slate-50">
            <div className="mx-auto max-w-[90rem]">
                <div className="max-w-3xl">
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Why Bitlasso
                    </p>
                </div>
            </div>

            <section className="border-b border-white/10">
                <div className="mx-auto max-w-[90rem]">
                    <div className="max-w-3xl">
                        <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1] tracking-tight">
                            Portable commerce infrastructure.
                        </h2>

                        <p className="mt-6 text-lg leading-[1.8] text-muted-foreground">
                            Payments, receipts, and metadata can be anchored for verifiable
                            and portable commerce flows.
                        </p>
                    </div>

                    <div className="mt-20 rounded-[2rem] border border-white/10 bg-white p-10 md:p-14">
                        <div className="grid gap-10 md:grid-cols-3">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Receipts",
                                    description:
                                        "Verifiable payment completion and customer history.",
                                },
                                {
                                    icon: Radio,
                                    title: "Metadata",
                                    description:
                                        "Portable commerce events and payment references.",
                                },
                                {
                                    icon: Layers3,
                                    title: "Ownership",
                                    description:
                                        "Merchants retain control over payments and relationships.",
                                },
                            ].map((item) => (
                                <div key={item.title} className="md:border-r md:border-b-0 border-b border-primary/20 last:border-r-0 last:border-b-0 pb-5">
                                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                                        <item.icon className="h-6 w-6 text-primary" />
                                    </div>

                                    <h3 className="text-xl font-semibold tracking-tight">
                                        {item.title}
                                    </h3>

                                    <p className="mt-4 text-[15px] leading-[1.8] text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto grid max-w-[90rem] gap-16 lg:grid-cols-[1fr_1fr] bg-slate-50 mt-20">
                        <div className="flex flex-col">
                            <h2 className="text-4xl leading-[1.05] tracking-tight text-primary">
                                Built for machine-native commerce.
                            </h2>

                            <p className="mt-6 max-w-xl text-lg leading-[1.8] text-muted-foreground">
                                Enable agents and AI systems to generate Lightning invoices, settle payments directly to their own wallets, and automate operational workflows in real time.
                            </p>

                            <div className="mt-10 flex gap-5">
                                <span className="bg-white px-10 py-2 rounded-lg border text-sm">L402</span>
                                <span className="bg-white px-10 py-2 rounded-lg border text-sm">MCP</span>
                                <span className="bg-white px-10 py-2 rounded-lg border text-sm">Webhook</span>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {[
                                "Autonomous invoice creation",
                                "Self-custodial agent wallets",
                                "Instant Lightning settlement",
                                "Programmable service automation",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white px-6 py-5"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Check className="h-4 w-4 text-primary" />
                                    </div>

                                    <p className="text-[15px]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </section>


        </section>
    )
}