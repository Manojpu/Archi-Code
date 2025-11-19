## Architecture Workbench

Generate architecture summaries, decision logs, and Mermaid diagrams directly from high-level requirements. The experience is built with the latest Next.js App Router, Shadcn-inspired UI primitives, and Gemini server actions—no API routes or login flows required.

### Features

- **Server Actions + Gemini** – Requirements are posted through a secure server action that calls the Gemini 1.5 Pro model to craft the plan.
- **Shadcn UI on the provided OKLCH palette** – Buttons, cards, and form controls use the custom theme in `app/globals.css` so everything matches the assignment constraints.
- **Markdown + Mermaid output** – The LLM is instructed to embed Mermaid code blocks; the client extracts and renders them with the `mermaid` runtime so diagrams stay in sync with the narrative.

### Prerequisites

1. Create a Gemini API key and keep it handy ([Google AI Studio](https://aistudio.google.com/app/apikey)).
2. Node 18+ (Next.js 16 requirement) and npm installed locally.

### Setup

1. Install dependencies (already done in this repo, but safe to repeat):

```bash
npm install
```

2. Create `.env.local` in the project root and add your Gemini key:

```bash
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-1.5-pro-latest # optional override
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the workbench. Provide business goals, constraints, and non-functional requirements; the response panel will show:

- A structured summary with reasoning.
- A decision log explaining trade-offs.
- One or more Mermaid diagrams, rendered inline, that you can copy into docs.

### Implementation Notes

- `app/actions/plan-architecture.ts` is the single server action that validates input, calls Gemini, and parses Markdown + Mermaid output.
- The Gemini model defaults to `gemini-1.5-pro-latest`; override it via `GEMINI_MODEL` if your key only has access to Flash or region-specific variants.
- `components/workbench/workbench-client.tsx` hosts the requirement form, status messages, and Mermaid renderer (`components/mermaid-chart.tsx`).
- UI primitives in `components/ui/*` follow Shadcn patterns and inherit the OKLCH theme from `globals.css`.

### Next steps

- Swap Gemini models (e.g., Flash vs. Pro) or tweak temperature/top-k inside the action if you need faster drafts.
- Extend the parser in `lib/workbench.ts` to support additional diagram syntaxes or multiple workbench tabs.
- Wire up persistence to store past plans for comparison reviews.
