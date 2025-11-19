"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

import type { PlanState } from "@/lib/workbench";
import { initialPlanState } from "@/lib/workbench";
import { MermaidChart } from "@/components/mermaid-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type WorkbenchClientProps = {
  action: (state: PlanState, formData: FormData) => Promise<PlanState>;
};

export function WorkbenchClient({ action }: WorkbenchClientProps) {
  const [state, formAction] = useActionState(action, initialPlanState);
  const [loadingPhase, setLoadingPhase] = useState<
    "thinking" | "building" | "finalizing" | null
  >(null);

  const samplePrompts = useMemo(
    () => [
      "Modernize a legacy insurance claims portal into cloud-native services",
      "Design an event-driven analytics stack for IoT sensors across factories",
      "Plan a composable commerce platform that scales for flash sales",
    ],
    []
  );

  return (
    <div className="space-y-8">
      <Card className="border-2 shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Describe Your Requirements</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Share business goals, constraints, and any existing systems. The
            workbench will synthesize patterns, suggest an architecture, and
            render Mermaid diagrams.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-base mb-3">
                High-level requirements
              </Label>
              <Textarea
                id="requirements"
                name="requirements"
                required
                minLength={16}
                placeholder="e.g., Build a privacy-first mobile banking platform that integrates with existing core banking APIs..."
                className="min-h-[200px] text-base"
                aria-describedby="requirements-hint"
              />
              <p
                id="requirements-hint"
                className="text-xs text-muted-foreground"
              >
                💡 Tip: Mention target users, SLAs, compliance, integrations,
                and non-functional requirements.
              </p>
            </div>
            <SubmitButton setLoadingPhase={setLoadingPhase} />
          </form>
          <Separator />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Need inspiration?
            </p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt) => (
                <Badge
                  key={prompt}
                  variant="outline"
                  className="cursor-default px-3 py-1.5 text-xs"
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {state.status !== "idle" && (
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              {state.status === "success" && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
              <CardTitle>Architecture Guidance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingPhase !== null && <LoadingState phase={loadingPhase} />}
            {state.status === "error" && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{state.error}</p>
              </div>
            )}
            {state.status === "success" && (
              <div className="space-y-6">
                <div className="space-y-3 text-sm leading-relaxed text-foreground">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {state.summary ?? ""}
                  </ReactMarkdown>
                </div>
                {state.diagrams && state.diagrams.length > 0 ? (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="text-base font-semibold text-foreground">
                      Architecture Diagrams
                    </h3>
                    <div className="space-y-4">
                      {state.diagrams.map((diagram) => (
                        <MermaidChart
                          key={diagram.id}
                          title={diagram.title}
                          definition={diagram.definition}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No Mermaid diagrams detected. Ask for a specific type of
                    view (component, sequence, or deployment).
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SubmitButton({
  setLoadingPhase,
}: {
  setLoadingPhase: (
    phase: "thinking" | "building" | "finalizing" | null
  ) => void;
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!pending) {
      setLoadingPhase(null);
      return;
    }

    setLoadingPhase("thinking");
    const timer1 = setTimeout(() => setLoadingPhase("building"), 3000);
    const timer2 = setTimeout(() => setLoadingPhase("finalizing"), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pending, setLoadingPhase]);

  return (
    <Button
      type="submit"
      className="w-full lg:w-auto border border-primary bg-primary text-primary-foreground hover:opacity-90 focus:ring-2 focus:ring-primary/50"
      disabled={pending}
      size="lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Architecture
        </>
      )}
    </Button>
  );
}

function LoadingState({
  phase,
}: {
  phase: "thinking" | "building" | "finalizing";
}) {
  const messages = {
    thinking: "Analyzing requirements and exploring patterns...",
    building: "Crafting architecture decisions and diagrams...",
    finalizing: "Polishing the blueprint and rendering visuals...",
  };

  return (
    <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">{messages[phase]}</p>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
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
