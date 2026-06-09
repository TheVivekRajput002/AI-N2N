import { FlowNode } from "../../types";
import { runLlm } from "../ai";

/**
 * Executes AI/Prompt nodes (e.g. LLM).
 */
export async function executeAiPrompt(
  node: FlowNode,
  resolvedInput: any
): Promise<any> {
  const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

  if (nodeType !== "llm") {
    throw new Error(`Node type "${node.type}" is not supported by AiPrompt`);
  }

  const provider =
    node.data?.nodeData?.["ai provider"] ||
    node.data?.nodeData?.provider ||
    node.data?.nodeData?.company ||
    "gemini";

  const apiKey =
    node.data?.nodeData?.["api key"] ||
    node.data?.nodeData?.apiKey ||
    node.data?.nodeData?.api_key ||
    (provider === "openai"
      ? process.env.OPENAI_API_KEY
      : provider === "groq"
      ? process.env.GROQ_API_KEY
      : process.env.GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error(`${provider.toUpperCase()} API Key is missing for LLM Node (ID: ${node.id}).`);
  }

  let prompt = resolvedInput;
  if (!prompt) {
    throw new Error(`LLM Node (ID: ${node.id}) has no incoming prompt value from previous node.`);
  }

  if (typeof prompt !== "string") {
    prompt = typeof prompt === "object" ? JSON.stringify(prompt) : String(prompt);
  }

  const systemPrompt =
    node.data?.nodeData?.["system prompt"] ||
    node.data?.nodeData?.systemPrompt ||
    node.data?.nodeData?.system_prompt ||
    undefined;

  const model =
    node.data?.nodeData?.model ||
    (provider === "openai"
      ? "gpt-4o"
      : provider === "groq"
      ? "llama-3.1-8b-instant"
      : "gemini-2.5-flash");

  return await runLlm({ prompt, apiKey, model, provider, systemPrompt });
}
