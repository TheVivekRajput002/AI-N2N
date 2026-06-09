import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
} from "reactflow";
import { apiPost } from "./api";

export interface WorkspacesResponse {
  workspaces: any[]
}

export interface WorkspaceType {
    id: string;
    name: string;
    description: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    workflows: any[];
}

export interface NewWorkspaceType {
    name: string;
    description: string;
    color: string;
    token: string | null;
}




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

export interface StoreState {
    nodes: Node[];
    edges: Edge[];
    nodeIDs: Record<string, number>;
    selectNodeId: string | null;
    isDirty: Boolean;
    getNodeID: (type: string) => string;
    addNode: (node: Node) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    updateNodeField: (nodeId: string, fieldName: string, fieldValue: unknown) => void;
}

export const useStore = create<StoreState>((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    selectNodeId: null,
    isDirty: false,
    getNodeID: (type) => {
        const nodeIDs = { ...get().nodeIDs, [type]: (get().nodeIDs[type] ?? 0) + 1 };
        set({ nodeIDs });
        return `${type}-${nodeIDs[type]}`;
    },

    addNode: (node: Node) => set((state) => ({ nodes: [...state.nodes, node] })),

    onNodesChange: (changes) =>
        set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

    onEdgesChange: (changes) =>
        set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

    onConnect: (connection) =>
        set((state) => ({
            edges: addEdge(
                {
                    ...connection,
                    type: "smoothstep",
                    animated: true,
                    markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 }, // numbers, not strings
                },
                state.edges
            ),
        })),

    updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) =>
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
                    : node
            ),
        })),
    setGraph: (nodes: Node[], edges: Edge[]) => set({ nodes, edges, isDirty: false }),
    selectNode: (nodeId: string | null) => set({ selectNodeId: nodeId }),
}));

export interface WorkspaceType {
    id: string;
    name: string;
    description: string;
    color: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    workflows: any[];
}

export interface NewWorkspaceType {
    name: string;
    description: string;
    color: string;
    token: string | null;
}

export interface WorkspaceSetState {
    workspaces: WorkspaceType[];
    setWorkspaces: (workspaces: WorkspaceType[]) => void;
    addWorkspace: (workspace: WorkspaceType) => void;
    deleteWorkspace: (id: string) => void;
}

export const useWorkspace = create<WorkspaceSetState>((set) => ({
    workspaces: [],
    setWorkspaces: (workspaces) => set({ workspaces }),
    addWorkspace: (workspace) => {
        set(s => ({ workspaces: [...s.workspaces, workspace] }))
    },
    deleteWorkspace: (id: string) => {
        set(s => ({ workspaces: s.workspaces.filter(w => w.id !== id) }))
    }
}))

export interface WorkflowVersionType {
    id: string;
    versionNumber: number;
    graph: any;
    createdAt: string;
    workflowId: string;
}

export interface WorkflowType {
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    currentVersionId: string | null;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    currentVersion?: WorkflowVersionType | null;
}

export interface WorkflowSetState {
    workflows: WorkflowType[];
    setWorkflows: (workflows: WorkflowType[]) => void;
    addWorkflow: (workflow: WorkflowType) => void;
    addWorflow: (workflow: WorkflowType) => void;
    removeWorkflow: (id: string) => void;
}

export const useWorkflow = create<WorkflowSetState>((set) => ({
    workflows: [],
    setWorkflows: (workflows) => set({ workflows }),
    addWorkflow: (workflow) => {
        set(s => ({ workflows: [...s.workflows, workflow] }))
    },
    addWorflow: (workflow) => {
        set(s => ({ workflows: [...s.workflows, workflow] }))
    },
    removeWorkflow: (id: string) => {
        set(s => ({ workflows: s.workflows.filter(w => w.id !== id) }))
    }
}))

export interface ExecutionState {
    lastExecutionDuration: number | null;
    lastExecutionStatus: string | null;
    setExecutionDetails: (duration: number | null, status: string | null) => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
    lastExecutionDuration: null,
    lastExecutionStatus: null,
    setExecutionDetails: (duration, status) => set({ lastExecutionDuration: duration, lastExecutionStatus: status }),
}));