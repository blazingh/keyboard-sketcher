import { Node } from "../stores/editor-store";

export function findEnclosingBox(nodes: Node[]) {
  if (nodes.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(node => {
    if (!node) return
    const pnts = getRotatedNodeCorners(node)
    pnts.forEach(pnt => {
      minX = Math.min(minX, pnt.x);
      minY = Math.min(minY, pnt.y);
      maxX = Math.max(maxX, pnt.x);
      maxY = Math.max(maxY, pnt.y);
    })
  });
  const width = maxX - minX;
  const height = maxY - minY;
  return {
    x: minX,
    y: minY,
    width: width,
    height: height
  };
}

export function getRotatedNodeCorners(node: Node, p: number = 0): { x: number, y: number }[] {
  const { pos: { x: centerX, y: centerY, r }, size: { w, h } } = node;
  // Convert angle from degrees to radians
  const radians = -r * Math.PI / 180;

  // Half width and half height
  const halfWidth = (w + p) / 2;
  const halfHeight = (h + p) / 2;

  // Define rotation matrix
  const rotationMatrix = [
    Math.cos(radians), -Math.sin(radians),
    Math.sin(radians), Math.cos(radians)
  ];

  // Create an array to store the corners
  const corners = [];

  // Calculate offsets for each corner relative to center
  const offsets = [
    [-halfWidth, -halfHeight],
    [halfWidth, -halfHeight],
    [halfWidth, halfHeight],
    [-halfWidth, halfHeight]
  ];

  // Apply rotation matrix to each offset and translate to center point
  for (const offset of offsets) {
    const rotatedX = offset[0] * rotationMatrix[0] + offset[1] * rotationMatrix[2] + centerX;
    const rotatedY = offset[0] * rotationMatrix[1] + offset[1] * rotationMatrix[3] + centerY;
    corners.push({ x: rotatedX, y: rotatedY });
  }

  return corners;
}

export function normalizeAngle(angle: number) {
  // Use modulo to wrap the angle within the range [0, 360)
  angle = angle % 360;

  // If the angle is negative, add 360 to wrap it into the positive range
  if (angle < 0) {
    angle += 360;
  }

  return angle;
}
