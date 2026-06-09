import { FlowNode } from "../../types";

/**
 * Executes Integration category nodes (e.g. HTTP GET, HTTP POST).
 */
export async function executeIntegration(
  node: FlowNode,
  resolvedInput: any
): Promise<any> {
  const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

  if (nodeType === "http_get" || nodeType === "http_post") {
    let url = node.data?.nodeData?.url || "";
    let headersStr = node.data?.nodeData?.headers || "{}";
    let bodyStr = node.data?.nodeData?.body || "{}";

    if (!url) {
      throw new Error(`URL is required for HTTP integration node (ID: ${node.id})`);
    }

    const interpolate = (str: string, val: any): string => {
      if (!str || typeof str !== "string") return str;
      const placeholderVal = typeof val === "object" ? JSON.stringify(val) : String(val);
      return str.replace(/\{\{input\}\}/gi, placeholderVal).replace(/\{\{value\}\}/gi, placeholderVal);
    };

    url = interpolate(url, resolvedInput);
    headersStr = interpolate(headersStr, resolvedInput);
    bodyStr = interpolate(bodyStr, resolvedInput);

    let headers: Record<string, string> = {};
    try {
      headers = JSON.parse(headersStr);
    } catch (err) {
      headers = {};
    }

    const method = nodeType === "http_get" ? "GET" : "POST";
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (method === "POST") {
      try {
        JSON.parse(bodyStr);
        options.body = bodyStr;
      } catch (err) {
        options.body = JSON.stringify({ input: resolvedInput });
      }
    }

    const response = await fetch(url, options);
    const responseText = await response.text();

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      data = responseText;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${method} to ${url} failed with status ${response.status}: ${responseText}`);
    }

    return data;
  }

  throw new Error(`Node type "${node.type}" is not supported by executeIntegration`);
}
