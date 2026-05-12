import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Link } from "react-router"


export const UseCaseHeroSection = () => {
    return (
        <section className="relative overflow-hidden border-b border-border/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]" />

            <div className="relative z-10 mx-auto flex min-h-[85svh] max-w-[90rem] flex-col justify-center px-6 py-32 sm:px-10 lg:px-16">
                <div className="max-w-5xl">
                    <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Use cases
                    </p>

                    <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight">
                        Built for recurring
                        <br />
                        Bitcoin commerce.
                    </h1>

                    <p className="mt-8 max-w-2xl text-lg leading-[1.9] text-muted-foreground">
                        From AI agents to APIs and digital products, Bitlasso helps
                        businesses accept Lightning payments, automate workflows, and create
                        repeat customer revenue.
                    </p>

                    <div className="mt-12 flex flex-wrap gap-4">
                        <Link
                            to="/app"
                            className="flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-[15px] font-medium text-background transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 "
                        >
                            Create your checkout
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="mt-16 flex flex-wrap gap-8">
                        {[
                            "Self-custodial",
                            "Instant settlement",
                            "Rewards built-in",
                            "Automation-ready",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}