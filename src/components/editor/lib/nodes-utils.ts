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

export function getRotatedNodeCorners(node: Node): { x: number, y: number }[] {
  const { pos: { x: centerX, y: centerY, r }, size: { w, h } } = node;
  // Convert rotation angle from degrees to radians
  const angle = r * Math.PI / 180;

  // Calculate the half-dimensions
  const halfWidth = w / 2;
  const halfHeight = h / 2;

  // Function to rotate a point around the center
  function rotatePoint(px: any, py: any, cx: any, cy: any, angle: any) {
    const dx = px - cx;
    const dy = py - cy;
    const newX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const newY = dx * Math.sin(angle) + dy * Math.cos(angle);
    return {
      x: newX + cx,
      y: newY + cy
    };
  }

  // Calculate the original corner points relative to the center
  const topLeft = { x: centerX - halfWidth, y: centerY - halfHeight };
  const topRight = { x: centerX + halfWidth, y: centerY - halfHeight };
  const bottomRight = { x: centerX + halfWidth, y: centerY + halfHeight };
  const bottomLeft = { x: centerX - halfWidth, y: centerY + halfHeight };

  // Rotate each corner point around the center
  const rotatedTopLeft = rotatePoint(topLeft.x, topLeft.y, centerX, centerY, angle);
  const rotatedTopRight = rotatePoint(topRight.x, topRight.y, centerX, centerY, angle);
  const rotatedBottomRight = rotatePoint(bottomRight.x, bottomRight.y, centerX, centerY, angle);
  const rotatedBottomLeft = rotatePoint(bottomLeft.x, bottomLeft.y, centerX, centerY, angle);

  // Return the corners in clockwise order starting from the top left
  return [
    rotatedTopLeft,
    rotatedTopRight,
    rotatedBottomRight,
    rotatedBottomLeft
  ];
}
