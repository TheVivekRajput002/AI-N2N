// src/data/initialElements.js

export const initialNodes = [
  {
    id: '1',                          // must be unique string
    type: 'customNode',                    // built-in type: has only a source handle
    position: { x: 250, y: 50 },     // x,y on the canvas
    data: { label: 'Start' },         // data.label is used by default nodes
  },
  {
    id: '2',
    type: 'customNode',                  // has both source and target handles
    position: { x: 250, y: 200 },
    data: { label: 'Process' },
  },
  {
    id: '3',
    type: 'output',                   // has only a target handle
    position: { x: 250, y: 350 },
    data: { label: 'End' },
  },
]

export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'customEdge',           // ← matches key in edgeTypes object
    data: { label: 'step 1' },
},
{
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'customEdge',           // ← matches key in edgeTypes object
    data: { label: 'step 1' },
  },
]