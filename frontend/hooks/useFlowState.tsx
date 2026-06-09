// src/hooks/useFlowState.tsx
import { useCallback, useRef } from 'react'
import { type Node, type Edge, useNodesState, useEdgesState, addEdge, type Connection, type ReactFlowInstance, type Viewport, MarkerType, reconnectEdge } from '@xyflow/react'
import { apiPost, apiGet } from '@/utils/api'
import { useParams } from 'next/navigation'
import { useToast } from '@/hooks/useToast'

export function useFlowState() {
  const { workflowId } = useParams() as { workflowId: string }
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { showToast } = useToast()

  const edgeReconnectSuccessful = useRef(true)

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

  // called when user starts dragging one end of an edge
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  // called when user successfully connects to a new handle
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds))
    },
    [setEdges]
  )

  // called when user drops the connection (either on another handle or empty space)
  const onReconnectEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))
      }
      edgeReconnectSuccessful.current = true
    },
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

  const saveFlow = useCallback(async (
    reactFlowInstance: ReactFlowInstance, 
    wId: string, 
    options?: { silent?: boolean }
  ) => {
    const flow = reactFlowInstance.toObject()
    const jsonFlow = JSON.stringify(flow)

    try {
      const response = await apiPost(`/workflow-version`, {
        graph: flow, // Save the actual JSON object to the database
        workflowId: wId,
      })

      console.log(response)
      localStorage.setItem(`savedFlow_${wId}`, jsonFlow)
      if (!options?.silent) {
        showToast('Saved successfully to cloud!', 'success')
      }
    } catch (error) {
      console.error("Failed to save flow:", error)
      localStorage.setItem(`savedFlow_${wId}`, jsonFlow)
      if (!options?.silent) {
        showToast('Failed to save to cloud, but saved locally in your browser. Please check your internet connection or backend server.', 'error')
      }
    }
  }, [showToast])

  // restore from API
  const restoreFlow = useCallback(async (setViewport: (viewport: Viewport) => void) => {
    if (!workflowId) return
    let loadedFromBackend = false
    try {
      const response = await apiGet<{ success: boolean, workflowVersion: any }>(`/workflow-version?workflowId=${workflowId}`)
      if (response.success && response.workflowVersion?.graph) {
        const graph = response.workflowVersion.graph
        
        // If graph was saved as a string (legacy/fallback), parse it; otherwise, use it directly
        const flow = typeof graph === 'string' ? JSON.parse(graph) : graph
        
        if (flow.nodes && flow.nodes.length > 0) {
          setNodes(flow.nodes)
          loadedFromBackend = true
        }
        if (flow.edges) setEdges(flow.edges)
        if (flow.viewport && setViewport) {
          setViewport(flow.viewport)
        }
      }
    } catch (error) {
      console.error("Failed to restore flow from backend:", error)
    }

    // Fallback to localStorage if backend didn't return any nodes
    if (!loadedFromBackend) {
      try {
        const localFlowStr = localStorage.getItem(`savedFlow_${workflowId}`)
        if (localFlowStr) {
          const flow = JSON.parse(localFlowStr)
          if (flow.nodes) setNodes(flow.nodes)
          if (flow.edges) setEdges(flow.edges)
          if (flow.viewport && setViewport) {
            setViewport(flow.viewport)
          }
          console.log("Restored flow from localStorage fallback")
        }
      } catch (err) {
        console.error("Failed to restore flow from localStorage:", err)
      }
    }
  }, [workflowId, setNodes, setEdges])

  return {
    nodes, edges,
    onNodesChange, onEdgesChange,
    onConnect, addNode, saveFlow, restoreFlow,
    setNodes,
    onReconnectStart,
    onReconnect,
    onReconnectEnd
  }
}