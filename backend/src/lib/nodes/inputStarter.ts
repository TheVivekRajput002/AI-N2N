import { FlowNode } from "../../types";

/**
 * Executes Input and Trigger nodes.
 */
export async function executeInputStarter(
  node: FlowNode,
  resolvedInput: any,
  globalInput?: any
): Promise<any> {
  const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

  if (nodeType === "input" || nodeType === "trigger") {
    if (typeof globalInput === "string" && globalInput) {
      return globalInput;
    } else if (globalInput && typeof globalInput === "object") {
      return globalInput[node.id] ?? globalInput.input ?? node.data?.nodeData?.input ?? "";
    } else {
      return node.data?.nodeData?.input ?? "";
    }
  }

  throw new Error(`Node type "${node.type}" is not supported by InputStarter`);
}
