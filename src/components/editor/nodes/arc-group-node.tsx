import { ArcGroup, Node, Pos, baseNodeState } from "../stores/editor-store"
import { produce } from "immer"
import { BasicNode } from "./basic-node";
import { rotatePoint } from "../lib/Pos-utils";

export function ArcGroupNode({ arc }: { arc: ArcGroup }) {

  return (
    arcsGhostNodes(arc).map((arc, index) => (
      <g
        key={index}
        className="opacity-30"
      >
        {arc.ghostNodes.map((node: any) => (
          <BasicNode
            key={node.id}
            node={node}
          />
        ))}
      </g>
    ))
  )
}

export function arcsGhostNodes(arc: ArcGroup): { ghostNodes: Node[], arcPath: string }[] {

  const {
    switchGaps,
    switchCounts,
    radiuses,
    pos,
  } = arc

  const arcs: any[] = []
  const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  switchCounts.forEach((switchCount, side) => {
    if (switchCount === 0) return
    // calculate the arcLength
    const arcLength = ((switchCount) * (140 + switchGaps[side]));
    // generate the arc svg path
    const arcPath = generateArcPath(arcLength, radiuses[side], pos, side as any)
    // generate the switches and place them on the arc
    const ghostNodes: Node[] = []
    for (let index = 1; index < switchCount + 1; index++) {
      ghostNodes.push(produce(baseNodeState, draft => {
        const distance = index * (140 + switchGaps[side])
        tempPath.setAttribute("d", arcPath);
        const { x, y } = tempPath.getPointAtLength(distance)
        draft.id = String(Math.random())
        draft.pos.x = x
        draft.pos.y = y
        draft.pos.r = getOrientation(distance, tempPath)
        draft.selectable = false
      }))
    }
    arcs.push({ ghostNodes, arcPath })
  })
  return arcs
}

function generateArcPath(arcLength: number, radius: number, center: Pos, side: 0 | 1 | 2 | 3) {
  // if the raidus in 0, the arc will be a straight line
  if (radius === 0) {
    let end: any = null
    if (!side || side === 2) // right
      end = rotatePoint({ x: center.x + arcLength, y: center.y, r: 0 }, { ...center, r: center.r })
    if (side === 0) //left 
      end = rotatePoint({ x: center.x - arcLength, y: center.y, r: 0 }, { ...center, r: center.r })
    const path = `M ${center.x},${center.y} L ${end.x},${end.y}`;
    return path
  }

  const circumference = 2 * Math.PI * radius;
  const angle = (arcLength / circumference) * (2 * Math.PI); // Convert arc length to radians
  const arcAngle = angle * (180 / Math.PI);   // convert radians to degrees

  // Calculate the ending points of the arcs
  const initEnd = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };

  // calculate the distance between the start and the end
  const length = Math.sqrt(
    Math.pow(radius - initEnd.x, 2) +
    Math.pow(0 - initEnd.y, 2)
  );

  // rotate the arc
  let end: any = null
  if (!side || side === 2) // right
    end = rotatePoint({ x: center.x + length, y: center.y, r: 0 }, { ...center, r: arcAngle / 2 + center.r })
  if (side === 0) //left 
    end = rotatePoint({ x: center.x - length, y: center.y, r: 0 }, { ...center, r: arcAngle / -2 + center.r })

  const largArcFlag = angle <= Math.PI ? 0 : 1;
  const sweepFlag = side === 2 ? 1 : 0

  // Construct the SVG path string
  const path = `M ${center.x},${center.y} A ${radius},${radius} 0 ${largArcFlag} ${sweepFlag} ${end.x},${end.y}`;

  return path
}

function getOrientation(distance: number, path: any) {
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
  return angleDegrees
  // + (angleDegrees < 0 ? 180 : -180)
}

