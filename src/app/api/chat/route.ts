import { cohere } from "@ai-sdk/cohere";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { z } from "zod";

const findTutorial = async (question: string) => {
  const { generateEmbedding } = await import("@/lib/ai/embedding");
  const queryEmbedding = await generateEmbedding(question);

  const res = await fetch("http://localhost:8080/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queryEmbedding, minSimilarity: 0.3, limit: 1 }),
  });

  const tutorial: { tour: number[]; desc: string; ai_steps: string }[] =
    await res.json();
  console.log("tutorial", tutorial);
  return {
    tour: tutorial[0].tour,
    desc: tutorial[0].desc,
    ai_steps: tutorial[0].ai_steps,
  };
};

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: cohere("command-a-reasoning-08-2025"),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
    temperature: 0.1,
    stopWhen: stepCountIs(5),
    system: `You are a helpful assistant. Only respond to questions using tool calls. 

- Always provide answers in a **structured format**, using:
  - **Bold headings** for sections
  - **Bullet points** for steps or instructions
  - **Code blocks** for commands or code snippets
  - **Numbered lists** for sequences or tutorials

- If no relevant tutorial is found, respond:  
  **"Sorry, I don't know."**

- If a tutorial is found:
  - Summarize the **ai_steps** clearly in bullet points
  - COMPULSORILY Suggest the user can **toggle the button below** to start a virtual tutorial
  - Include any **tips, warnings, or prerequisites** if relevant

- Keep responses concise, readable, and user-friendly, similar to a **README file**.
`,
    tools: {
      getTutorial: tool({
        description: "Get tutorial from the knowledge base",
        inputSchema: z.object({
          question: z.string().describe("The user's question"),
        }),
        execute: async ({ question }) => await findTutorial(question),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
