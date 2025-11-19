export type DiagramResult = {
  id: string;
  title: string;
  definition: string;
};

export type PlanState = {
  status: "idle" | "success" | "error";
  summary?: string;
  diagrams?: DiagramResult[];
  raw?: string;
  error?: string;
};

export const initialPlanState: PlanState = {
  status: "idle",
};

const MERMAID_BLOCK = /```mermaid\s*([\s\S]*?)```/gi;

export function extractArchitectureResponse(markdown: string) {
  const diagrams: DiagramResult[] = [];
  let match: RegExpExecArray | null;

  while ((match = MERMAID_BLOCK.exec(markdown)) !== null) {
    const definition = match[1]?.trim();
    if (!definition) continue;

    const heading = findHeadingBefore(markdown, match.index);
    diagrams.push({
      id:
        typeof globalThis.crypto?.randomUUID === "function"
          ? globalThis.crypto.randomUUID()
          : `diagram-${Date.now()}-${diagrams.length}`,
      title: heading ?? `Diagram ${diagrams.length + 1}`,
      definition,
    });
  }

  const summary = markdown.replace(/```mermaid\s*([\s\S]*?)```/gi, "").trim();

  return {
    summary:
      summary ||
      "The model returned diagrams only. Please resubmit for narrative context.",
    diagrams,
  };
}

function findHeadingBefore(content: string, index: number) {
  const chunk = content.slice(0, index);
  const headingMatch = chunk.match(/(?:^|\n)#{2,6}\s*(.+)$/);
  return headingMatch?.[1]?.trim();
}
