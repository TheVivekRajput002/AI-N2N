// src/hooks/useFlowState.tsx
import { useCallback } from 'react'
import { type Node, type Edge, useNodesState, useEdgesState, addEdge, type Connection, type ReactFlowInstance, type Viewport, MarkerType } from '@xyflow/react'
import { apiPost, apiGet } from '@/utils/api'
import { useParams } from 'next/navigation'

export function useFlowState() {
  const { workflowId } = useParams() as { workflowId: string }
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // called when user draws a new connection between two handles
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({
      ...connection,
      type: 'customEdge',
      animated: true,
      markerEnd: {
        type: MarkerType.Arrow,
        height: 20,
        width: 20,
      }
    }, eds)),
    [setEdges]
  )

  // add a new node programmatically
  const addNode = useCallback((
    nodeType: string,
    data: { label: string, description?: string, nodeData?: Record<string, any> },
    position?: { x: number, y: number }
  ) => {

    const newNode: Node = {
      id: String(crypto.randomUUID()),
      type: nodeType || 'default',
      position: position || { x: Math.random() * 400, y: Math.random() * 400 },
      data: data || { label: 'New Node' },
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  // save to API
  const saveFlow = useCallback(async (reactFlowInstance: ReactFlowInstance, wId: string) => {
    const flow = reactFlowInstance.toObject()
    const jsonFlow = JSON.stringify(flow)

    try {
      const response = await apiPost(`/workflow-version`, {
        graph: flow, // Save the actual JSON object to the database
        workflowId: wId,
      })

      console.log(response)
      localStorage.setItem('savedFlow', jsonFlow)
    } catch (error) {
      console.error("Failed to save flow:", error)
    }

    alert('Saved!')
  }, [])

  // restore from API
  const restoreFlow = useCallback(async (setViewport: (viewport: Viewport) => void) => {
    if (!workflowId) return
    try {
      const response = await apiGet<{ success: boolean, workflowVersion: any }>(`/workflow-version?workflowId=${workflowId}`)
      if (response.success && response.workflowVersion?.graph) {
        const graph = response.workflowVersion.graph
        
        // If graph was saved as a string (legacy/fallback), parse it; otherwise, use it directly
        const flow = typeof graph === 'string' ? JSON.parse(graph) : graph
        
        if (flow.nodes) setNodes(flow.nodes)
        if (flow.edges) setEdges(flow.edges)
        if (flow.viewport && setViewport) {
          setViewport(flow.viewport)
        }
      }
    } catch (error) {
      console.error("Failed to restore flow from backend:", error)
    }
  }, [workflowId, setNodes, setEdges])

  return {
    nodes, edges,
    onNodesChange, onEdgesChange,
    onConnect, addNode, saveFlow, restoreFlow,
    setNodes
  }
}