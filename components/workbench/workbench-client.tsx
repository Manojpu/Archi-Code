"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PlanState } from "@/lib/workbench";
import { initialPlanState } from "@/lib/workbench";
import { MermaidChart } from "@/components/mermaid-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type WorkbenchClientProps = {
  action: (state: PlanState, formData: FormData) => Promise<PlanState>;
};

export function WorkbenchClient({ action }: WorkbenchClientProps) {
  const [state, formAction] = useActionState(action, initialPlanState);

  const samplePrompts = useMemo(
    () => [
      "Modernize a legacy insurance claims portal into cloud-native services",
      "Design an event-driven analytics stack for IoT sensors across factories",
      "Plan a composable commerce platform that scales for flash sales",
    ],
    []
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card className="h-fit">
        <CardHeader className="space-y-2">
          <CardTitle>Describe the requirements</CardTitle>
          <p className="text-sm text-muted-foreground">
            Share business goals, constraints, and any existing systems. The
            workbench will synthesize patterns, suggest an architecture, and
            render Mermaid diagrams.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">High-level requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                required
                minLength={16}
                placeholder="e.g. Build a privacy-first mobile banking platform that integrates with existing core banking APIs..."
                className="min-h-[180px]"
                aria-describedby="requirements-hint"
              />
              <p
                id="requirements-hint"
                className="text-xs text-muted-foreground"
              >
                Tip: Mention target users, SLAs, compliance, integrations, and
                non-functional requirements.
              </p>
            </div>
            <SubmitButton />
          </form>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Need inspiration?
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {samplePrompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {prompt}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Architecture guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.status === "idle" ? <EmptyState /> : null}
          {state.status === "error" ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          {state.status === "success" ? (
            <div className="space-y-4">
              <div className="space-y-3 text-sm leading-relaxed text-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {state.summary ?? ""}
                </ReactMarkdown>
              </div>
              {state.diagrams && state.diagrams.length > 0 ? (
                <div className="space-y-3">
                  {state.diagrams.map((diagram) => (
                    <MermaidChart
                      key={diagram.id}
                      title={diagram.title}
                      definition={diagram.definition}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No Mermaid diagrams detected. Ask for a specific type of view
                  (component, sequence, or deployment).
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full lg:w-auto" disabled={pending}>
      {pending ? "Designing…" : "Generate architecture"}
    </Button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
      Submit requirements to receive a structured summary, decision log, and
      Mermaid diagrams you can copy into docs.
    </div>
  );
}
