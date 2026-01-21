"use server";

import { generateEmbeddings } from "@/lib/ai/embedding";
import { TutorialFlowConfig } from "@/tutorial/types";
import fs from "fs";
// @ts-ignore
import gTTS from "gtts";
import path from "path";

const FLOWS_DIR = path.join(process.cwd(), "src/tutorial/flows");
const AUDIO_DIR = path.join(process.cwd(), "public/tutorials");

export async function generateStepAudio(
  tour: string,
  stepIndex: number,
  text: string,
) {
  const tourDir = path.join(AUDIO_DIR, tour);
  if (!fs.existsSync(tourDir)) {
    fs.mkdirSync(tourDir, { recursive: true });
  }

  const filePath = path.join(tourDir, `${stepIndex}.mp3`);

  const tts = new gTTS(text, "en");
  tts.save(filePath, (err: any) => {
    if (err) {
      console.error(
        `❌ Failed to generate audio for step ${stepIndex} of tour "${tour}"`,
        err,
      );
    } else {
      console.log(`✅ Generated audio for step ${stepIndex} of tour "${tour}"`);
    }
  });
}

export async function ingestFlowFiles() {
  try {
    const files = fs
      .readdirSync(FLOWS_DIR)
      .filter((file) => file.endsWith(".flow.json"));

    for (const file of files) {
      const filePath = path.join(FLOWS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf-8");

      const parsed: TutorialFlowConfig = JSON.parse(raw);
      const { tour, description, steps } = parsed;

      const stepDescriptions = steps
        .map((s) => s.step_desc)
        .filter(Boolean) as string[];

      const embeddings = await generateEmbeddings(description);

      stepDescriptions.forEach((desc, i) =>
        generateStepAudio(tour, i + 1, desc),
      );

      try {
        const res = await fetch("http://localhost:8080/insert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tour,
            description,
            step_descriptions: stepDescriptions,
            embedding: embeddings[0].embedding,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("INSERT FAILED:", errorText);
          throw new Error(errorText);
        }

        console.log(`✅ Flow "${tour}" ingested successfully`);
      } catch (error) {
        console.error(error);
      }
    }

    return "All flow files embedded successfully";
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to ingest flows";
  }
}
