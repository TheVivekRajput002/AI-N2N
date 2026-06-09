import { FlowNode } from "../../types";

/**
 * Executes Transform category nodes (e.g. Delay).
 */
export async function executeTransform(
  node: FlowNode,
  resolvedInput: any
): Promise<any> {
  const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

  if (nodeType === "delay") {
    const timeVal = node.data?.nodeData?.time;
    const timeMs = parseInt(String(timeVal), 10) || 1000;

    await new Promise((resolve) => setTimeout(resolve, timeMs));
    return resolvedInput;
  }

  throw new Error(`Node type "${node.type}" is not supported by executeTransform`);
}
