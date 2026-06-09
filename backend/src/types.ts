
export interface User {
    id: string;
    clerkId: string;
    name: string;
    email: string; 
}

export interface FlowNode {
  id: string;
  type?: string;
  data: {
    label: string;
    description?: string;
    nodeData?: Record<string, any>;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface ExecuteGraphOptions {
  nodes: FlowNode[];
  edges: FlowEdge[];
  executionId: string;
  globalInput?: any;
}

