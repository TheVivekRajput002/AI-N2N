// src/edges/CustomEdge.jsx
import { BaseEdge, EdgeLabelRenderer, getStraightPath, type EdgeProps } from '@xyflow/react'

type CustomEdgeData = {
    label: string
    description?: string
}

type CustomEdgeProps = EdgeProps & {
    data?: CustomEdgeData
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data, markerEnd }: CustomEdgeProps) {
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX, sourceY, targetX, targetY
    })

    return (
        <>
            {/* The actual line */}
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#6366f1' }} />

            {/* Label floating in the middle of the edge */}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                        background: '#1e1e2e',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        border: '1px solid #444',
                        pointerEvents: 'all',  // allows clicking the label
                    }}
                >
                    {data?.label || 'edge'}
                </div>
            </EdgeLabelRenderer>
        </>
    )
}

export default CustomEdge