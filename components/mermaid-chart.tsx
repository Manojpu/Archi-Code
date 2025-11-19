"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

import { cn } from "@/lib/utils";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "neutral",
});

interface MermaidChartProps {
  definition: string;
  title?: string;
  className?: string;
}

export function MermaidChart({
  definition,
  title,
  className,
}: MermaidChartProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const id = useId().replace(/[:]/g, "");

  useEffect(() => {
    let cancelled = false;
    async function renderDiagram() {
      try {
        const { svg } = await mermaid.render(`diagram-${id}`, definition);
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to render diagram"
          );
        }
      }
    }
    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [definition, id]);

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-border bg-card/60 p-4",
        className
      )}
    >
      {title ? (
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {title}
        </p>
      ) : null}
      {error ? (
        <pre className="text-sm text-destructive">{error}</pre>
      ) : (
        <div className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
}
