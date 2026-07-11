'use client';

import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AnimatedEdge({
    id: _id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Check if this edge is "active" based on data passed from the store or parent
    // Just relying on style.stroke for now if passed, or we can use a class
    const isAnimated = data?.animated || style.strokeDasharray;

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            {isAnimated && (
                <circle r="4" fill="#3b82f6">
                    <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
                </circle>
            )}
        </>
    );
}
