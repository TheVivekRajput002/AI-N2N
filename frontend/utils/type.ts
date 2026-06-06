


export interface WorkflowNode<TData = Record<string, any>> {
  id:string
  type: string;
  position: {x: number, y: number};
  data: TData;
  style?:{
    width: number,
    height:number
  }
} 

// Edge representation
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// Full graph saved inside `WorkflowVersion`
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}