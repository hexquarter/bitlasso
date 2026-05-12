import { Terminal } from "lucide-react"

export const DeveloperCodeSection = () => {
    return (
        <section className="border-b border-white/10 px-6 sm:px-10 lg:px-16 bg-slate-50">
            <section className="border-b border-white/10 px-6 py-32 sm:px-10 lg:px-16">
                <div className="mx-auto grid max-w-[90rem] gap-20 lg:grid-cols-[1fr_1.1fr]">
                    <div>
                        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                            API
                        </p>

                        <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight">
                            Create payment flows
                            <br />
                            in seconds.
                        </h2>

                        <p className="mt-6 max-w-xl text-lg leading-[1.8] text-muted-foreground">
                            Generate Lightning payment requests programmatically and trigger
                            backend workflows instantly.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-3">
                            {[
                                "Webhooks",
                                "Self-custodial",
                                "Instant settlement",
                                "L402-ready",
                            ].map((tag) => (
                                <div
                                    key={tag}
                                    className="rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm text-primary"
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
                        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
                            <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                            <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                        </div>

                        <div className="p-8">
                            <div className="mb-6 flex items-center gap-3 text-sm text-white/40">
                                <Terminal className="h-4 w-4" />
                                payment.ts
                            </div>

                            <pre className="overflow-x-auto text-sm leading-[2] text-white/80">
                                <code>{`import { initializeWallet } from "@bitlasso/sdk"

const wallet = await initializeWallet({
  seed: {type: 'mnemonic', mnemonic: ''},
  breezApiKey: 'your-api-key'
})

const paymentRequest = await publishPaymentRequest(wallet, {
  items: [
    { title: "Consulting session", amount: 100 }
  ],
  discountRate: 10
})`}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>
        </section>



    )
}