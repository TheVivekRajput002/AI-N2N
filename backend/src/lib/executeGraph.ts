import prisma from "../config/db";
import { executeInputStarter } from "./nodes/inputStarter";
import { executeAiPrompt } from "./nodes/aiPrompt";
import { executeLogic } from "./nodes/logic";
import { executeTransform } from "./nodes/transform";
import { executeIntegration } from "./nodes/integration";
import { executeOutput } from "./nodes/output";
import { ExecuteGraphOptions, FlowEdge, FlowNode } from "../types";

// Kahn's Algorithm (Topological Sort).

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

    // Check if this node should be skipped (all parents were skipped)
    const parentOutputs = nodeInputs[node.id] || {};
    const parentValues = Object.values(parentOutputs);
    const isSkipped = parentValues.length > 0 && parentValues.every(val => val === "__SKIPPED_BRANCH__");

    if (isSkipped) {
      // Create SKIPPED nodeExecution record directly
      await prisma.nodeExecution.create({
        data: {
          nodeId: node.id,
          nodeType: node.type || node.data?.label || "unknown",
          executionId: executionId,
          status: "SKIPPED",
          input: parentOutputs,
          startedAt: new Date(),
          finishedAt: new Date(),
        },
      });

      // Propagate SKIPPED status to all targets
      const targets = adjMap[node.id] || [];
      for (const targetId of targets) {
        if (!nodeInputs[targetId]) {
          nodeInputs[targetId] = {};
        }
        nodeInputs[targetId][node.id] = "__SKIPPED_BRANCH__";

        inDegree[targetId]--;
        if (inDegree[targetId] === 0) {
          queue.push(targetId);
        }
      }

      executedCount++;
      continue;
    }

    // 1. Create RUNNING nodeExecution record
    const nodeExec = await prisma.nodeExecution.create({
      data: {
        nodeId: node.id,
        nodeType: node.type || node.data?.label || "unknown",
        executionId: executionId,
        status: "RUNNING",
        input: parentOutputs,
        startedAt: new Date(),
      },
    });

    try {
      // 2. Resolve inputs from parent nodes
      let resolvedInput: any = "";
      const activeParentValues = parentValues.filter(
        (val) => val !== undefined && val !== null && val !== "__SKIPPED_BRANCH__"
      );

      if (activeParentValues.length === 1) {
        resolvedInput = activeParentValues[0];
      } else if (activeParentValues.length > 1) {
        resolvedInput = activeParentValues; // Pass array if multiple incoming branches
      }

      // 3. Execute node logic
      let output: any = "";

      if (nodeType === "input") {
        output = await executeInputStarter(node, resolvedInput, globalInput);
      } else if (nodeType === "llm" || nodeType === "llm_free" || nodeType === "llm free") {
        output = await executeAiPrompt(node, resolvedInput);
      } else if (nodeType === "conditional") {
        output = await executeLogic(node, resolvedInput, nodeOutputs, nodes);
      } else if (nodeType === "delay") {
        output = await executeTransform(node, resolvedInput);
      } else if (nodeType === "http_get" || nodeType === "http_post") {
        output = await executeIntegration(node, resolvedInput);
      } else if (nodeType === "output" || nodeType === "email") {
        output = await executeOutput(node, resolvedInput);
      } else {
        // Pass-through node behavior for non-functional nodes
        output = parentValues.length > 0 ? resolvedInput : (node.data?.nodeData || {});
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

        let propagatedValue = output;
        const edge = edges.find((e) => e.source === node.id && e.target === targetId);

        if (nodeType === "conditional" && output && typeof output === "object" && "conditionMet" in output) {
          const isTrue = !!output.conditionMet;
          const handle = edge?.sourceHandle || "true";
          if ((isTrue && handle === "false") || (!isTrue && handle === "true")) {
            propagatedValue = "__SKIPPED_BRANCH__";
          } else {
            propagatedValue = output.value;
          }
        }

        nodeInputs[targetId][node.id] = propagatedValue;

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
