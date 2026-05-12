import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

export const UseCaseCTASection = () => {
    return (
        <section className="px-6 py-32 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-4xl text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-foreground/70">
                    Start today
                </p>

                <h2 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] tracking-tight">
                    Start accepting
                    <br />
                    Lightning payments.
                </h2>

                <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.9] text-muted-foreground">
                    Create self-custodial Lightning payment flows with rewards,
                    automation, and recurring customer infrastructure built in.
                </p>

                <div className="mt-12 flex flex-wrap justify-center gap-4">
                    <Link
                        to="/app"
                        className="flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-[15px] font-medium text-background transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10 "
                    >
                        Create your checkout
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    )
}