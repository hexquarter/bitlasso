import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function ProtocolCTASection() {
    return (
        <section className="px-6 py-32 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] px-10 py-24 text-center backdrop-blur-xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                    Developers
                </p>

                <h2 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight">
                    Explore automated Lightning invoicing.
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.9] text-zinc-400">
                    Build programmable Lightning payment flows with APIs,
                    webhooks, automation, and self-custodial settlement.
                </p>

                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <Link
                        to="/developers"
                        className="flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-[15px] font-medium text-background transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 "
                    >
                        Discover how to integrate within your app
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}