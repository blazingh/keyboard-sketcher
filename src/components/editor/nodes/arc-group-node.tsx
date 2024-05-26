import { ArcGroup, Node, Pos, baseNodeState } from "../stores/editor-store"
import { produce } from "immer"
import { BasicNode } from "./basic-node";

export function ArcGroupNode({ arc }: { arc: ArcGroup }) {

  const {
    switchGap,
    switchCount,
    radius,
    pos,
  } = arc

  function arcs() {
    let arcNodes: any[] = []
    switchCount.forEach((switchC, num) => {
      if (switchC === 0) return
      const totalLength = ((switchCount[num] - 1) * (140 + switchGap[num]));
      const v = generateArcPath(totalLength, radius[num], pos, num as any)
      const array: Node[] = []
      for (let index = 0; index < switchCount[num]; index++) {
        array.push(produce(baseNodeState, draft => {
          const distance = index * (140 + switchGap[num])
          const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          tempPath.setAttribute("d", v.path);
          const arcPoint = tempPath.getPointAtLength(distance)
          draft.id = String(Math.random())
          draft.pos.x = arcPoint.x
          draft.pos.y = arcPoint.y
          draft.pos.r = getOrientation(distance, tempPath)
        }))
      }
      arcNodes.push({ array, v })
    })
    return arcNodes
  }

  return (
    <g>
      {
        arcs().map((arc, index) => (
          <g
            key={index}
            className="opacity-30"
          >
            {arc.array.map((node: any) => (
              <BasicNode
                key={node.id}
                node={node}
              />
            ))}
            {/*
          <circle
            cx={pos.x}
            cy={pos.y}
            r={2}
            stroke='red'
            fill='red'
          />
          <path
            d={arc.v.path}
            strokeWidth={2}
            stroke='white'
            fill='none'
            strokeOpacity={0.5}
          />
          */}
          </g>
        ))}
    </g>
  )
}

function getOrientation(distance: any, path: any) {
  // Calculate the tangent vectors at the point (using both increment and decrement)
  const tangentIncrement = path.getPointAtLength(distance + 1);
  const tangentDecrement = path.getPointAtLength(distance + -1);

  // Calculate the tangent vector by subtracting the point coordinates
  var tangentX = tangentIncrement.x - tangentDecrement.x;
  var tangentY = tangentIncrement.y - tangentDecrement.y;

  // Calculate the angle between the tangent vector and the x-axis
  var angleRadians = Math.atan2(tangentY, tangentX);
  var angleDegrees = angleRadians * (180 / Math.PI);

  // Adjust the angle to point away from the path (if needed)
  return angleDegrees + (angleDegrees < 0 ? 180 : -180)
}

function generateArcPath(arcLength: number, _radius: number, center: Pos, dir: 0 | 1 | 2 | 3) {
  let radius = _radius

  const circumference = 2 * Math.PI * radius;
  const angle = (arcLength / circumference) * (2 * Math.PI); // Convert arc length to radians
  const arcAngle = angle * (180 / Math.PI);   // convert radians to degrees

  // Calculate the starting and ending points of the arcs
  const initStart = { x: radius, y: 0 };
  const initEnd = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };

  // calculate the distance between the start and the end
  const length = Math.sqrt(
    Math.pow(initStart.x - initEnd.x, 2) +
    Math.pow(initStart.y - initEnd.y, 2)
  );

  // rotato the arc
  const start = center
  let end: any = null
  if (!dir || dir === 2) // right
    end = rotatePoint({ x: center.x + length, y: 0, r: 0 }, { ...center, r: arcAngle / 2 })
  if (dir === 0) //left 
    end = rotatePoint({ x: center.x - length, y: 0, r: 0 }, { ...center, r: arcAngle / -2 + center.r })

  // Determine the sweep flag (whether the arc is drawn in the positive or negative direction)
  const sweepFlag = angle <= Math.PI ? 0 : 1;

  // Construct the SVG path string
  let path: any = null
  if (!dir || dir === 2) // right
    path = `M ${start.x},${start.y} A ${radius},${radius} 0 ${sweepFlag} 1 ${end.x},${end.y}`;
  if (dir === 0) // left
    path = `M ${start.x},${start.y} A ${radius},${radius} 0 ${sweepFlag} 0 ${end.x},${end.y}`;

  return {
    path
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
