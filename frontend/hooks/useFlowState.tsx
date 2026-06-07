// src/hooks/useFlowState.js
import { useCallback } from 'react'
import { type Node, useNodesState, useEdgesState, addEdge, type Connection, type ReactFlowInstance, type Viewport } from '@xyflow/react'
import { apiPost } from '@/utils/api'

export function useFlowState() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // called when user draws a new connection between two handles
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  // add a new node programmatically
  const addNode = useCallback((
    nodeType: string,
    data: { label: string, description?: string },
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

  // save to localStorage
  const saveFlow = useCallback(async (reactFlowInstance: ReactFlowInstance, workflowId: string) => {
    const flow = reactFlowInstance.toObject()
    const jsonFlow = JSON.stringify(flow)

    try {

      const response = await apiPost(`/workflow-version`, {
        graph: jsonFlow,
        workflowId: workflowId,
      })

      console.log(response)

      localStorage.setItem('savedFlow', jsonFlow)
      
    } catch (error) {

    }

    alert('Saved!')
  }, [])

  // restore from localStorage
  const restoreFlow = useCallback((setViewport: (Viewport: Viewport) => void) => {
    const saved = localStorage.getItem('savedFlow')
    if (!saved) return
    const flow = JSON.parse(saved)
    setNodes(flow.nodes)
    setEdges(flow.edges)
    setViewport(flow.viewport)
  }, [setNodes, setEdges])

  return {
    nodes, edges,
    onNodesChange, onEdgesChange,
    onConnect, addNode, saveFlow, restoreFlow
  }
}