import prisma from "@/config/db";
import { runLlm } from "./ai";

interface FlowNode {
  id: string;
  type?: string;
  data: {
    label: string;
    description?: string;
    nodeData?: Record<string, any>;
  };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
}

interface ExecuteGraphOptions {
  nodes: FlowNode[];
  edges: FlowEdge[];
  executionId: string;
  globalInput?: any;
}

/**
 * Executes a workflow graph using Kahn's Algorithm (Topological Sort).
 * Processes nodes sequentially, handling parent-to-child data forwarding and logging to Prisma.
 */
export async function executeGraph({
  nodes,
  edges,
  executionId,
  globalInput,
}: ExecuteGraphOptions): Promise<Record<string, any>> {
  const inDegree: Record<string, number> = {};
  const adjMap: Record<string, string[]> = {};
  const nodeOutputs: Record<string, any> = {};
  
  // nodeInputs collects input from parents: targetNodeId -> { parentNodeId: output }
  const nodeInputs: Record<string, Record<string, any>> = {};

  // Initialize graph helper structures
  for (const node of nodes) {
    inDegree[node.id] = 0;
    adjMap[node.id] = [];
    nodeInputs[node.id] = {};
  }

  for (const edge of edges) {
    if (adjMap[edge.source]) {
      adjMap[edge.source].push(edge.target);
    }
    if (edge.target in inDegree) {
      inDegree[edge.target]++;
    }
  }

  // Find initial starting nodes (nodes with 0 incoming dependencies)
  const queue: string[] = [];
  for (const node of nodes) {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  }

  let executedCount = 0;

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!currentId) continue;

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

    // 1. Create RUNNING nodeExecution record
    const nodeExec = await prisma.nodeExecution.create({
      data: {
        nodeId: node.id,
        nodeType: node.type || node.data?.label || "unknown",
        executionId: executionId,
        status: "RUNNING",
        input: nodeInputs[node.id] || {},
        startedAt: new Date(),
      },
    });

    try {
      // 2. Resolve inputs from parent nodes
      const parentOutputs = nodeInputs[node.id] || {};
      let resolvedInput: any = "";
      const parentValues = Object.values(parentOutputs);

      if (parentValues.length === 1) {
        resolvedInput = parentValues[0];
      } else if (parentValues.length > 1) {
        resolvedInput = parentValues; // Pass array if multiple incoming branches
      }

      // 3. Execute node logic
      let output: any = "";

      if (nodeType === "input" || nodeType === "trigger") {
        // Input or Trigger node logic
        if (typeof globalInput === "string" && globalInput) {
          output = globalInput;
        } else if (globalInput && typeof globalInput === "object") {
          output = globalInput[node.id] ?? globalInput.input ?? node.data?.nodeData?.input ?? "";
        } else {
          output = node.data?.nodeData?.input ?? "";
        }
      } else if (nodeType === "llm") {
        // LLM Node logic
        const apiKey =
          node.data?.nodeData?.["api key"] ||
          node.data?.nodeData?.apiKey ||
          node.data?.nodeData?.api_key ||
          process.env.GEMINI_API_KEY;

        if (!apiKey) {
          throw new Error(`Gemini API Key is missing for LLM Node (ID: ${node.id}).`);
        }

        let prompt = resolvedInput;
        if (!prompt) {
          throw new Error(`LLM Node (ID: ${node.id}) has no incoming prompt value from previous node.`);
        }

        if (typeof prompt !== "string") {
          prompt = typeof prompt === "object" ? JSON.stringify(prompt) : String(prompt);
        }

        const model = node.data?.nodeData?.model || "gemini-2.5-flash";
        output = await runLlm({ prompt, apiKey, model });
      } else {
        // Pass-through node behavior for non-functional nodes
        output = resolvedInput || node.data?.nodeData || {};
      }

      nodeOutputs[node.id] = output;
      executedCount++;

      // 4. Update nodeExecution record on Success
      await prisma.nodeExecution.update({
        where: { id: nodeExec.id },
        data: {
          status: "SUCCESS",
          output: output,
          finishedAt: new Date(),
        },
      });

      // 5. Propagate inputs to target nodes
      const targets = adjMap[node.id] || [];
      for (const targetId of targets) {
        if (!nodeInputs[targetId]) {
          nodeInputs[targetId] = {};
        }
        nodeInputs[targetId][node.id] = output;

        inDegree[targetId]--;
        if (inDegree[targetId] === 0) {
          queue.push(targetId);
        }
      }
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      
      // Update nodeExecution record on Failure
      await prisma.nodeExecution.update({
        where: { id: nodeExec.id },
        data: {
          status: "FAILED",
          error: errorMsg,
          finishedAt: new Date(),
        },
      });

      throw new Error(`Node (ID: ${node.id}, Type: ${node.type}) failed: ${errorMsg}`);
    }
  }

  // Check if there was a cycle (some nodes not executed)
  if (executedCount < nodes.length) {
    throw new Error("Cycle detected in graph or unreachable nodes found during traversal");
  }

  // Find outputs of leaf nodes (no outgoing edges) to represent final graph output
  const leafNodeOutputs: Record<string, any> = {};
  for (const node of nodes) {
    const targets = adjMap[node.id] || [];
    if (targets.length === 0) {
      leafNodeOutputs[node.id] = nodeOutputs[node.id];
    }
  }

  return leafNodeOutputs;
}
