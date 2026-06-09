import { FlowNode } from "../../types";

/**
 * Executes Output category nodes (e.g. Standard Output, Email).
 */
export async function executeOutput(
  node: FlowNode,
  resolvedInput: any
): Promise<any> {
  const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

  if (nodeType === "output") {
    const outputTemplate = node.data?.nodeData?.output;
    if (outputTemplate && typeof outputTemplate === "string") {
      const placeholderVal = typeof resolvedInput === "object" ? JSON.stringify(resolvedInput) : String(resolvedInput);
      return outputTemplate.replace(/\{\{input\}\}/gi, placeholderVal).replace(/\{\{value\}\}/gi, placeholderVal);
    }
    return resolvedInput;
  }

  if (nodeType === "email") {
    const email = node.data?.nodeData?.email || "";
    const subject = node.data?.nodeData?.subject || "Workflow Notification";
    const messageTemplate = node.data?.nodeData?.message || "";

    if (!email) {
      throw new Error(`Recipient Email is required for Email Node (ID: ${node.id})`);
    }

    const placeholderVal = typeof resolvedInput === "object" ? JSON.stringify(resolvedInput) : String(resolvedInput);
    const message = messageTemplate
      ? messageTemplate.replace(/\{\{input\}\}/gi, placeholderVal).replace(/\{\{value\}\}/gi, placeholderVal)
      : placeholderVal;

    console.log(`[Email Node] Sending email to: ${email}`);
    console.log(`[Email Node] Subject: ${subject}`);
    console.log(`[Email Node] Message Body: ${message}`);

    return {
      success: true,
      sentTo: email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  throw new Error(`Node type "${node.type}" is not supported by executeOutput`);
}
