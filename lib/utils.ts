import { internalsSymbol, Position } from 'reactflow';

export const storage = {
  getToken: () =>
    window.localStorage.getItem('accessToken')
      ? JSON.parse(window.localStorage.getItem('accessToken') || '')
      : '',
  setToken: (token: string) => window.localStorage.setItem('accessToken', JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem('accessToken'),
};

function getNodeCenter(node) {
  return {
    x: node.positionAbsolute.x + node.width / 2,
    y: node.positionAbsolute.y + node.height / 2,
  };
}

function getHandleCoordsByPosition(node, handlePosition, handleId) {
  // all handles are from type source, that's why we use handleBounds.source here
  console.log(handleId);
  const handle = node[internalsSymbol].handleBounds.source.find((h) => h.id === handleId);
  // || node[internalsSymbol].handleBounds.source[0];

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending on which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
  }

  const x = node.positionAbsolute.x + handle.x + offsetX;
  const y = node.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

// returns the position (top,right,bottom or right) passed node compared to
function getParams(nodeA, nodeB, handleIdA, handleIdB) {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  // const position = centerA.x > centerB.x ? Position.Left : Position.Right;
  let position;

  if (nodeB[internalsSymbol].handleBounds.source.length < 4) {
    if (horizontalDiff > verticalDiff) {
      position = centerA.x > centerB.x ? Position.Left : Position.Right;
    } else {
      // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
      position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
    }
  } else {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  }

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle

  const [x, y] = getHandleCoordsByPosition(nodeA, position, handleIdA || handleIdB);
  return [x, y, position];
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, target, sourceHandleId, targetHandleId) {
  const [sx, sy, sourcePos] = getParams(source, target, sourceHandleId, targetHandleId);
  const [tx, ty, targetPos] = getParams(target, source, targetHandleId, sourceHandleId);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
