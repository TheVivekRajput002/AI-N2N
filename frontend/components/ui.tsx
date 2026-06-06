// ui.tsx
// Displays the drag-and-drop UI
// --------------------------------------------------

"use client"
import { useShallow } from 'zustand/react/shallow';
import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  ReactFlowInstance,
  ConnectionLineType
} from 'reactflow';
import { useStore, StoreState } from '../utils/store';
import { InputNode } from './nodes/InputNode';
import { LLMNode } from './nodes/LLMNode';
import { OutputNode } from './nodes/OutputNode';
import { TextNode } from './nodes/TextNode';
import BaseNode from './nodes/BaseNode';
import { NodesLibrary } from './NodesLibrary';

import 'reactflow/dist/style.css';

const gridSize = 30;
const proOptions = { hideAttribution: true };

const makeBaseNode = (label: string): NodeTypes[string] =>
  (props) => <BaseNode label={label} {...props} />;

const nodeTypes: NodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  trigger: makeBaseNode('Trigger'),
  action: makeBaseNode('Action'),
  notification: makeBaseNode('Notification'),
  conditional: makeBaseNode('Conditional'),
  delay: makeBaseNode('Delay'),
  userTask: makeBaseNode('User Task'),
  loop: makeBaseNode('Loop'),
  subprocess: makeBaseNode('Sub-process'),
  parallel: makeBaseNode('Parallel'),
  decision: makeBaseNode('Decision'),
  merge: makeBaseNode('Merge'),
  exception: makeBaseNode('Exception'),
};

const selector = (state: StoreState) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(useShallow(selector));


  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!bounds || !raw || !reactFlowInstance) return;

      const { nodeType: type } = JSON.parse(raw) as { nodeType: string };
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className='w-full h-full z-0 relative'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background color="var(--flow-grid-color)" gap={gridSize} />

        <Controls className='scale-110 border border-[var(--minimap-border-color)] shadow-xl rounded-md overflow-hidden backdrop-blur-md bg-opacity-80' />

        <MiniMap
          className="border border-[var(--minimap-border-color)] shadow-2xl rounded-xl opacity-90 backdrop-blur-sm"
          style={{
            width: 200,
            height: 120,
            backgroundColor: 'var(--minimap-bg-color)',
            border: '1px solid var(--minimap-border-color)',
            borderRadius: '0.75rem',
            opacity: 0.4,
            bottom: 15,
            right: 15,
          }}
          maskColor="var(--minimap-mask-color)"
          nodeColor="var(--minimap-node-color)"
          nodeStrokeWidth={3}
        />
      </ReactFlow>

      <NodesLibrary />
    </div>
  );
};