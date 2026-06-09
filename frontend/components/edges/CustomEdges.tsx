// src/edges/CustomEdge.jsx
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react'

type CustomEdgeData = {
    label: string
    description?: string
}

type CustomEdgeProps = EdgeProps & {
    data?: CustomEdgeData
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, selected }: CustomEdgeProps) {
    const [edgePath] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition
    })

    return (
        <BaseEdge 
            id={id} 
            path={edgePath} 
            markerEnd={markerEnd} 
            style={{ 
                stroke: selected ? 'hsl(var(--ios-blue))' : '#94a3b8', 
                strokeWidth: selected ? 3 : 2,
                transition: 'stroke 0.2s, stroke-width 0.2s'
            }} 
        />
    )
}

export default CustomEdge