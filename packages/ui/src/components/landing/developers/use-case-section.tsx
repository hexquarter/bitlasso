import { Bot, Code2, Repeat, Workflow } from "lucide-react"

const useCases = [
    {
        icon: Bot,
        title: "AI Agents",
        description:
            "Enable machine-to-machine payments and usage-based access.",
    },
    {
        icon: Code2,
        title: "APIs",
        description:
            "Monetize endpoints with Lightning-native payment flows.",
    },
    {
        icon: Repeat,
        title: "SaaS Billing",
        description:
            "Build recurring payment and retention systems.",
    },
    {
        icon: Workflow,
        title: "Automation",
        description:
            "Trigger webhooks and backend workflows instantly.",
    },
]

export const DeveloperUseCaseSection = () => {
    return (
        <section className="border-b border-white/10 px-6 py-32 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-[90rem]">
                <div className="max-w-3xl">
                    <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
                        Built for
                    </p>

                    <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1] tracking-tight">
                        Infrastructure for modern
                        <br />
                        internet commerce.
                    </h2>
                </div>

                <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {useCases.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl shadow-lg bg-primary/5 p-8"
                        >
                            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
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
        </section>
    )
}