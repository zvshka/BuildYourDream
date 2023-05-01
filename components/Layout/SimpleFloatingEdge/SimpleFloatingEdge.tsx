import { useCallback } from 'react';
import { getBezierPath, useStore } from 'reactflow';
import { getEdgeParams } from '../../../lib/utils';

function SimpleFloatingEdge({
  id,
  source,
  sourceHandleId,
  target,
  targetHandleId,
  markerEnd,
  style,
}: {
  id: string;
  source: any;
  sourceHandleId?: any;
  target: any;
  targetHandleId?: any;
  markerEnd?: any;
  style?: any;
}) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
    sourceHandleId,
    targetHandleId
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      strokeWidth={5}
      markerEnd={markerEnd}
      style={style}
    />
  );
}

export default SimpleFloatingEdge;
