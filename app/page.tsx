import { WorkbenchClient } from "@/components/workbench/workbench-client";
import { planArchitecture } from "./actions/plan-architecture";

export default function Home() {
  return (
    <div className="bg-background">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:py-24">
        <section className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Software engineering workbench
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
              Automate solution architecture from plain-language requirements.
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground lg:text-lg">
              Feed business goals, operational constraints, and quality
              attributes. The workbench will craft an actionable blueprint,
              document reasoning, and render Mermaid diagrams ready for docs.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Server Actions securely call Gemini using your API key",
              "Shadcn-styled UI with the provided OKLCH palette",
              "Markdown + Mermaid output for architecture reviews",
            ].map((item) => (
              <li
                key={item}
                className="rounded-lg border border-border bg-card/70 px-3 py-2 text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
        <WorkbenchClient action={planArchitecture} />
      </main>
    </div>
  );
}
