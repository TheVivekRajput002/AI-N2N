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

// MUST import the css or nodes/edges won't render correctly
import '@xyflow/react/dist/style.css'

import { useFlowState } from '@/hooks/useFlowState'
import CustomNode from './nodes/CustomNode'
import CustomEdge from './edges/CustomEdges'
import { NodesLibrary } from './NodesLibrary'

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
  customInput: CustomNode,
  llm: CustomNode,
  customOutput: CustomNode,
  text: CustomNode,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

function Flow() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");
  const { toObject, setViewport, screenToFlowPosition } = useReactFlow()
  const {
    nodes, edges,
    onNodesChange, onEdgesChange,
    onConnect, addNode, saveFlow, restoreFlow
  } = useFlowState()

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
        const { nodeType, label, description } = JSON.parse(rawData)

        // Get drop position relative to canvas
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        addNode(nodeType, { label, description }, position)
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
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />

      {/* Zoom controls bottom-left */}
      <Controls />

      {/* Mini map bottom-right */}
      <MiniMap nodeStrokeWidth={3} />


      <div className='absolute top-15 right-15 z-50'>



      </div>

      <NodesLibrary />

    </ReactFlow>
  )
}

export default Flow