"use server";

import fs from "fs";
import path from "path";
import { generateEmbeddings } from "@/lib/ai/embedding";
import { TutorialFlowConfig } from "@/tutorial/types";

const FLOWS_DIR = path.join(process.cwd(), "src/tutorial/flows");

export async function ingestFlowFiles() {
  try {
    const files = fs
      .readdirSync(FLOWS_DIR)
      .filter((file) => file.endsWith(".flow.json"));

    for (const file of files) {
      const filePath = path.join(FLOWS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");

      const parsed: TutorialFlowConfig = JSON.parse(raw);

      const { tour, description, ai_steps } = parsed;

      const embeddings = await generateEmbeddings(description);

      try {
        const res = await fetch("http://localhost:8080/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tour,
            description,
            ai_steps,
            embedding: embeddings[0].embedding,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("INSERT FAILED:", errorText);
          throw new Error(errorText);
        }

        return res;
      } catch (error) {
        console.log(error);
      }
    }

    return "All flow files embedded successfully";
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to ingest flows";
  }
}
