import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

interface RunLlmOptions {
  prompt: string;
  apiKey: string;
  model?: string;
  provider?: string;
  systemPrompt?: string;
}

/**
 * Runs an LLM generation using Vercel AI SDK.
 * Supports Google Gemini, OpenAI, and Groq by dynamically configuring provider instances.
 */
export async function runLlm({
  prompt,
  apiKey,
  model,
  provider = "gemini",
  systemPrompt,
}: RunLlmOptions): Promise<string> {
  if (!apiKey) {
    throw new Error(`${provider} API key is required for LLM node execution`);
  }

  let aiModel: any;

  if (provider === "openai") {
    const openai = createOpenAI({
      apiKey,
    });
    aiModel = openai(model || "gpt-4o");
  } else if (provider === "groq") {
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });
    aiModel = groq(model || "llama-3.1-8b-instant");
  } else if (provider === "gemini") {
    const google = createGoogleGenerativeAI({
      apiKey,
    });
    aiModel = google(model || "gemini-2.5-flash");
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  const { text } = await generateText({
    model: aiModel,
    prompt: prompt,
    system: systemPrompt || undefined,
  });

  return text;
}
