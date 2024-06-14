import { Pos } from "../stores/editor-store";

export function rotatePoint(point: Pos, center: Pos): { x: number, y: number } {
  // Convert angle from degrees to radians
  var angleRad = center.r * Math.PI / 180;

  // Translate the point so that the center becomes the origin
  var translatedPoint = {
    x: point.x - center.x,
    y: point.y - center.y
  };

  // Apply rotation using trigonometric formulas
  var rotatedPoint = {
    x: translatedPoint.x * Math.cos(angleRad) - translatedPoint.y * Math.sin(angleRad),
    y: translatedPoint.x * Math.sin(angleRad) + translatedPoint.y * Math.cos(angleRad)
  };

  // Translate the rotated point back to its original position
  rotatedPoint.x += center.x;
  rotatedPoint.y += center.y;

  return rotatedPoint;
}

export function pointsDistance(point1: any, point2: any) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Function to calculate center position (midpoint) between two points
export function pointsCenter(point1: any, point2: any) {
  const centerX = (point1.x + point2.x) / 2;
  const centerY = (point1.y + point2.y) / 2;
  return { x: centerX, y: centerY };
}
