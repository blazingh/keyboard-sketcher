import { ArcGroup, Node, Pos, baseNodeState } from "../stores/editor-store"
import { produce } from "immer"
import { BasicNode } from "./basic-node";
import { useViewportTransformationStore } from "../stores/viewport-transformation-store";

export function ArcGroupNode({ arc }: { arc: ArcGroup }) {

  const { switchGap, switchCount, pos, radius } = arc

  const totalLength = (switchCount * 140) + ((switchCount - 1) * switchGap);
  const v = generateArcPath(totalLength, radius, pos)

  const arcNodes = () => {
    const array: Node[] = []
    for (let index = 0; index < switchCount; index++) {
      array.push(produce(baseNodeState, draft => {
        const distance = index * (140 + switchGap) + 70
        const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempPath.setAttribute("d", v.path);
        const arcPoint = tempPath.getPointAtLength(distance)
        draft.id = String(Math.random())
        draft.pos.x = arcPoint.x
        draft.pos.y = arcPoint.y
        draft.pos.r = getOrientation(distance, tempPath)
      }))
    }
    return array
  }

  return (
    <g
    >
      <circle
        cx={pos.x}
        cy={pos.y}
        r={2}
        stroke='red'
        fill='red'
      />
      {arcNodes().map((node) => (
        <BasicNode
          key={node.id}
          node={node}
        />
      ))}
      <path
        d={v.path}
        strokeWidth={2}
        stroke='white'
        fill='none'
        strokeOpacity={0.5}
      />
    </g>
  )
}

function getOrientation(distance: any, path: any) {
  // Calculate the tangent vectors at the point (using both increment and decrement)
  var increment = 1; // Increment to get the point slightly ahead
  var decrement = -1; // Decrement to get the point slightly behind
  var tangentIncrement = path.getPointAtLength(distance + increment);
  var tangentDecrement = path.getPointAtLength(distance + decrement);

  // Calculate the tangent vector by subtracting the point coordinates
  var tangentX = tangentIncrement.x - tangentDecrement.x;
  var tangentY = tangentIncrement.y - tangentDecrement.y;

  // Calculate the angle between the tangent vector and the x-axis
  var angleRadians = Math.atan2(tangentY, tangentX);
  var angleDegrees = angleRadians * (180 / Math.PI);

  // Adjust the angle to point away from the path (if needed)
  if (angleDegrees < 0) {
    angleDegrees += 180;
  } else {
    angleDegrees -= 180;
  }
  return angleDegrees
}

function generateArcPath(arcLength: number, radius: number, center: Pos) {
  const circumference = 2 * Math.PI * radius;
  const angle = (arcLength / circumference) * (2 * Math.PI); // Convert arc length to radians

  // Calculate the starting and ending points of the arcs
  const initStart = { x: radius, y: 0 };
  const initEnd = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };

  // calculate the distance between the start and end
  const length = Math.sqrt(
    Math.pow(initStart.x - initEnd.x, 2) +
    Math.pow(initStart.y - initEnd.y, 2)
  );

  // rotato the arc
  const start = rotatePoint({ x: center.x - length / 2, y: 0, r: 0 }, center)
  const end = rotatePoint({ x: center.x + length / 2, y: 0, r: 0 }, center)

  // Determine the sweep flag (whether the arc is drawn in the positive or negative direction)
  const sweepFlag = angle <= Math.PI ? 0 : 1;

  // Construct the SVG path string
  const path = `M ${start.x},${start.y} A ${radius},${radius} 0 ${sweepFlag} 1 ${end.x},${end.y}`;

  return {
    path,
  }
}

function rotatePoint(point: Pos, center: Pos) {
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

