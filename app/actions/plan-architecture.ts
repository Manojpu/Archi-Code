"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { extractArchitectureResponse, type PlanState } from "@/lib/workbench";

export async function planArchitecture(
  _: PlanState,
  formData: FormData
): Promise<PlanState> {
  const requirements = formData.get("requirements");

  if (!requirements || typeof requirements !== "string") {
    return {
      status: "error",
      error: "Describe the product or system you want to build.",
    };
  }

  const trimmed = requirements.trim();

  if (!trimmed) {
    return {
      status: "error",
      error:
        "Please provide a bit more detail so I can design with confidence.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY env var");
    return {
      status: "error",
      error:
        "Server is missing the Gemini API key. Add GEMINI_API_KEY to continue.",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = buildPrompt(trimmed);

    const generation = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
      },
    });

    const text = generation.response.text()?.trim();

    console.log("Gemini response:", text);

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const { summary, diagrams } = extractArchitectureResponse(text);

    return {
      status: "success",
      summary,
      diagrams,
      raw: text,
    };
  } catch (error) {
    console.error("Gemini planning failed", error);
    return {
      status: "error",
      error:
        error instanceof Error
          ? error.message
          : "Unable to connect to Gemini right now. Please try again shortly.",
    };
  }
}

function buildPrompt(requirements: string) {
  return `You are an expert software architect helping to design systems.
Requirements:
"""
${requirements}
"""

Return a concise plan in Markdown with the following shape:

## Summary
- list 3-5 key design choices
- describe major components, data flow, and trade-offs

## Architecture Decisions
- include bullet points that justify the decisions

## Recommended Diagram
- introduce the diagram in prose before the code block
- include at least one \`\`\`mermaid\`\`\` block that visualizes the solution
- prefer component or sequence diagrams depending on fit

CRITICAL Mermaid syntax rules:
- Use simple node labels WITHOUT line breaks, <br> tags, or special HTML
- Use parentheses () for rounded nodes, square brackets [] for rectangles
- Keep all labels SHORT and SINGLE-LINE (e.g., "API Gateway" not "API Gateway<br>(Azure)")
- Put detailed technology choices in comments or the narrative text, NOT in node labels
- Use subgraphs for logical grouping (e.g., "subgraph Azure Cloud", "subgraph Microservices")
- Valid example: C[API Gateway] or AGW(API Gateway) — NOT C[API Gateway<br>(Azure)]

Keep the tone professional and actionable.`;
}
