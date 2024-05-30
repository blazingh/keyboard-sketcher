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
