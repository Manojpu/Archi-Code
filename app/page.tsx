import { WorkbenchClient } from "@/components/workbench/workbench-client";
import { planArchitecture } from "./actions/plan-architecture";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 lg:py-24">
        <section className="space-y-8 text-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Software Engineering Workbench
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
              Design smarter architectures,
              <br />
              <span className="text-primary">powered by AI</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground lg:text-lg">
              Describe your requirements in plain language. Get actionable
              blueprints, decision logs, and Mermaid diagrams—crafted by Gemini
              and ready for your docs.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              "🔒 Secure Server Actions",
              "🎨 Elegant OKLCH Palette",
              "📊 Mermaid Diagrams",
            ].map((item) => (
              <div
                key={item}
                className="rounded-full border border-border bg-card px-4 py-2 text-foreground shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
        <Separator className="mx-auto w-24" />
        <WorkbenchClient action={planArchitecture} />
      </main>
    </div>
  );
}
