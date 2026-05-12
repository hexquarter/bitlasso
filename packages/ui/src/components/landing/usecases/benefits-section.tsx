export const UseCaseBenefitsSection = () => {
  return (
    <section className="border-b border-border/40 bg-slate-50 px-6 py-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-20 lg:grid-cols-2">
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              Why Bitlasso
            </p>

            <h2 className="font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1] tracking-tight">
              Keep your revenue.
              <br />
              Own your commerce.
            </h2>
          </div>

          <div className="grid gap-5">
            {[
              {
                title: "Self-custodial by default",
                description:
                  "Payments settle directly to your own wallet.",
              },
              {
                title: "No percentage fees",
                description:
                  "Flat pricing without taxing your growth.",
              },
              {
                title: "Built for automation",
                description:
                  "Connect APIs, agents, and workflows natively.",
              },
              {
                title: "Retention built-in",
                description:
                  "Turn transactions into recurring customer activity.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border/40 bg-background p-8"
              >
                <h3 className="text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-[15px] leading-[1.8] text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}