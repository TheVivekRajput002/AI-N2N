import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

interface RunLlmOptions {
  prompt: string;
  apiKey: string;
  model?: string;
}

/**
 * Runs an LLM generation using Vercel AI SDK and Google Gemini.
 * Dynamically configures the Google provider with the user-provided API key.
 */
export async function runLlm({ prompt, apiKey, model = "gemini-2.5-flash" }: RunLlmOptions): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API key is required for LLM node execution");
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  });

  const { text } = await generateText({
    model: google(model),
    prompt: prompt,
  });

  return text;
}
