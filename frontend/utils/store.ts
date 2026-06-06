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
    selectNodeId:null,
    isDirty:false,
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
    setGraph: (nodes: Node[], edges: Edge[]) => set({nodes, edges, isDirty: false}),
    selectNode: (nodeId: string | null) => set({selectNodeId : nodeId}),
}));