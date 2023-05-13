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

function getHandle(handle, handlePosition: string, sourceHandleId: string, targetHandleId: string) {
  const sourceIsSlot = sourceHandleId.startsWith('slot');
  const targetIsSlot = targetHandleId.startsWith('slot');
  let result = true;

  if (targetIsSlot) {
    const isLeft = handlePosition === 'left' && handle.id.endsWith('l');
    const isRight = handlePosition === 'right' && handle.id.endsWith('r');
    const isTop = handlePosition === 'top' && handle.id.endsWith('t');
    const isBottom = handlePosition === 'bottom' && handle.id.endsWith('b');

    result = isLeft || isRight || isTop || isBottom;
  } else if (sourceIsSlot) {
    const handleIncludesId = handle.id.includes(/slot-(.*)-[l|r]/gi.exec(sourceHandleId)?.[1]);
    const isLeft = handlePosition === 'left' && handle.id.endsWith('l');
    const isRight = handlePosition === 'right' && handle.id.endsWith('r');

    result = handleIncludesId && (isLeft || isRight);
  }

  return result;
}

function getHandleCoordsByPosition(source, handlePosition, sourceHandleId, targetHandleId) {
  // all handles are from type source, that's why we use handleBounds.source here
  const handle =
    source[internalsSymbol].handleBounds.source.find((h) =>
      getHandle(h, handlePosition, sourceHandleId, targetHandleId)
    ) || source[internalsSymbol].handleBounds.source[0];

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

  const x = source.positionAbsolute.x + handle.x + offsetX;
  const y = source.positionAbsolute.y + handle.y + offsetY;

  return [x, y];
}

// returns the position (top,right,bottom or right) passed node compared to
function getParams(source, target, sourceHandle, targetHandle) {
  const centerA = getNodeCenter(source);
  const centerB = getNodeCenter(target);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  // const position = centerA.x > centerB.x ? Position.Left : Position.Right;
  let position;

  if (!sourceHandle.includes('slot')) {
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

  const [x, y] = getHandleCoordsByPosition(source, position, sourceHandle, targetHandle);
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

export /**
 * Tests whether two values are deeply equal using same-value equality.
 *
 * Two values are considered deeply equal iff 1) they are the same value, or
 * 2) they are both non-callable objects whose own, enumerable, string-keyed
 * properties are deeply equal.
 *
 * Caution: This function does not fully support circular references. Use this
 * function only if you are sure that at least one of the arguments has no
 * circular references.
 */
function deepEqual(x, y) {
  // If either x or y is not an object, then they are deeply equal iff they
  // are the same value. For our purposes, objects exclude functions,
  // primitive values, null, and undefined.
  if (typeof x !== 'object' || x === null || typeof y !== 'object' || y === null) {
    // We use Object.is() to check for same-value equality. To check for
    // strict equality, we would use x === y instead.
    return Object.is(x, y);
  }

  // Shortcut, in case x and y are the same object. Every object is
  // deeply equal to itself.
  if (x === y) return true;

  // Obtain the own, enumerable, string-keyed properties of x. We ignore
  // properties defined along x's prototype chain, non-enumerable properties,
  // and properties whose keys are symbols.
  const keys = Object.keys(x);
  // If x and y have a different number of properties, then they are not
  // deeply equal.
  if (Object.keys(y).length !== keys.length) return false;

  // For each own, enumerable, string property key of x:
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    // If key is not also an own enumerable property of y, or if x[key] and
    // y[key] are not themselves deeply equal, then x and y are not deeply
    // equal. Note that we don't just call y.propertyIsEnumerable(),
    // because y might not have such a method (for example, if it was
    // created using Object.create(null)), or it might not be the same
    // method that exists on Object.prototype.
    if (!Object.prototype.propertyIsEnumerable.call(y, key) || !deepEqual(x[key], y[key])) {
      return false;
    }
  }

  // x and y have the same properties, and all of those properties are deeply
  // equal, so x and y are deeply equal.
  return true;
}
