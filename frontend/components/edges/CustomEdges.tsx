// src/edges/CustomEdge.jsx
import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react'

type CustomEdgeData = {
    label: string
    description?: string
}

type CustomEdgeProps = EdgeProps & {
    data?: CustomEdgeData
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd }: CustomEdgeProps) {
    const [edgePath] = getSmoothStepPath({
        sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition
    })

    return (
        <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: '#00000' }} />
    )
}

export default CustomEdge