import { FlowNode } from "../../types";

export interface LogicResult {
  nodeType: "conditional";
  conditionMet?: boolean;
  value: any;
}

/**
 * Executes Logic category nodes: Conditional, Switch, Loop.
 */
export async function executeLogic(
  node: FlowNode,
  resolvedInput: any,
  nodeOutputs?: Record<string, any>,
  nodes?: FlowNode[]
): Promise<LogicResult> {
  const nodeType = (node.type || "").toLowerCase() || (node.data?.label || "").toLowerCase();

  if (nodeType === "conditional") {
    const condition = node.data?.nodeData?.condition;
    let conditionMet = false;

    if (condition && typeof condition === "string") {
      try {
        const contextObj: Record<string, any> = {};
        let varCounter = 0;

        // Parse and map all {{expression}} references to $context.vX variables
        const parsedCondition = condition.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
          const trimmed = expression.trim();

          // Support {{input}} and {{value}} directly mapping to resolvedInput
          if (trimmed === "input" || trimmed === "value") {
            const varName = `v${varCounter++}`;
            contextObj[varName] = resolvedInput;
            return `$context.${varName}`;
          }

          const dotIndex = trimmed.indexOf('.');
          let nodeRef = trimmed;
          let propertyPath = "";

          if (dotIndex !== -1) {
            nodeRef = trimmed.substring(0, dotIndex).trim();
            propertyPath = trimmed.substring(dotIndex + 1).trim();
          }

          // Search for matching node in the provided nodes list
          let targetNode: FlowNode | undefined = undefined;
          if (nodes) {
            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const normRef = normalize(nodeRef);
            targetNode = nodes.find(n => 
              n.id === nodeRef || 
              normalize(n.data?.label || "") === normRef ||
              normalize(n.type || "") === normRef
            );
          }

          let value: any = undefined;
          if (targetNode && nodeOutputs) {
            const nodeOut = nodeOutputs[targetNode.id];
            if (nodeOut !== undefined && nodeOut !== null) {
              if (propertyPath) {
                if (typeof nodeOut === 'object' && propertyPath in nodeOut) {
                  value = nodeOut[propertyPath];
                } else if (propertyPath === 'output' && (typeof nodeOut !== 'object' || !('output' in nodeOut))) {
                  value = nodeOut;
                } else {
                  value = nodeOut[propertyPath];
                }
              } else {
                value = nodeOut;
              }
            }
          }

          const varName = `v${varCounter++}`;
          contextObj[varName] = value;
          return `$context.${varName}`;
        });

        // Evaluate the constructed condition in a sandbox Function context
        const fn = new Function("$context", "input", `
          try {
            return !!(${parsedCondition});
          } catch (e) {
            return false;
          }
        `);
        conditionMet = fn(contextObj, resolvedInput);
      } catch (err) {
        console.error("Failed to parse and run condition expression:", err);
        conditionMet = String(resolvedInput) === condition || !!resolvedInput;
      }
    } else {
      conditionMet = !!resolvedInput;
    }

    return {
      nodeType: "conditional",
      conditionMet,
      value: resolvedInput,
    };
  }

  throw new Error(`Node type "${node.type}" is not supported by executeLogic`);
}
