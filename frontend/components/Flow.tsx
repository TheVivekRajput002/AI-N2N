// src/Flow.jsx
"use client"

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
} from '@xyflow/react'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

// MUST import the css or nodes/edges won't render correctly
import '@xyflow/react/dist/style.css'

import { useFlowState } from '@/hooks/useFlowState'
import CustomNode from './nodes/CustomNode'
import CustomEdge from './edges/CustomEdges'
import { NodesLibrary } from './NodesLibrary'
import FlowBar from './FlowBar'


// Register your custom types OUTSIDE the component
// (if defined inside, React re-creates them every render → flickering)
const nodeTypes = {
  customNode: CustomNode,
  trigger: CustomNode,
  action: CustomNode,
  notification: CustomNode,
  conditional: CustomNode,
  delay: CustomNode,
  userTask: CustomNode,
  loop: CustomNode,
  subprocess: CustomNode,
  parallel: CustomNode,
  decision: CustomNode,
  merge: CustomNode,
  exception: CustomNode,
  input: CustomNode,
  llm: CustomNode,
  output: CustomNode,
  text: CustomNode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

function Flow() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("dark");
  const { workflowId } = useParams() as { workflowId: string }
  const reactFlowInstance = useReactFlow()
  const { toObject, setViewport, screenToFlowPosition } = reactFlowInstance
  const {
    nodes, edges,
    onNodesChange, onEdgesChange,
    onConnect, addNode, saveFlow, restoreFlow,
    setNodes
  } = useFlowState()

  const handleSave = useCallback(() => {
    saveFlow(reactFlowInstance, workflowId)
  }, [saveFlow, reactFlowInstance, workflowId])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const rawData = event.dataTransfer.getData('application/reactflow')
      if (!rawData) return

      try {
        const { nodeType, label, description, nodeData } = JSON.parse(rawData)

        // Get drop position relative to canvas
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        addNode(nodeType, { label, description, nodeData }, position)
      } catch (err) {
        console.error('Error parsing dropped node data:', err)
      }
    },
    [screenToFlowPosition, addNode]
  )

  useEffect(() => {
    setColorMode(
      document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
    );
  }, []);

  useEffect(() => {
    restoreFlow(setViewport)
  }, [restoreFlow, setViewport]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onDragOver={onDragOver}
      onDrop={onDrop}
      colorMode={colorMode}
      fitView                          // auto-fit nodes on first load
    >
      {/* Grid background */}
      <Background variant={BackgroundVariant.Dots} gap={30} />

      {/* Zoom controls bottom-left */}
      <Controls className='scale-110 border border-[var(--minimap-border-color)] shadow-xl rounded-md overflow-hidden backdrop-blur-md bg-opacity-80' />

      {/* Mini map bottom-right */}


      <MiniMap
        className=" border border-[var(--minimap-border-color)] shadow-2xl rounded-xl opacity-90 backdrop-blur-sm"
        style={{
          width: 200,
          height: 120,
          backgroundColor: 'var(--minimap-bg-color)',
          border: '1px solid var(--minimap-border-color)',
          borderRadius: '0.75rem',
          opacity: 0.4,
          bottom: 25,
        }}
        maskColor="var(--minimap-mask-color)"
        nodeColor="var(--minimap-node-color)"
        nodeStrokeWidth={3}
      />



      <NodesLibrary />

      <FlowBar 
        nodes={nodes} 
        setNodes={setNodes} 
        onSave={handleSave} 
      />

    </ReactFlow>
  )
}

export default Flow