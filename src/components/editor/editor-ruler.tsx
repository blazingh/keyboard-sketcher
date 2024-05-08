import { produce } from "immer"
import { Node, useEditorStore } from "./stores/editor-store"

export function EditorRuler({
  transform
}: {
  transform: string
}) {

  const store = useEditorStore()

  const [a, b] = [
    produce(store.nodes[store.rulerNodes[0]], (draft: Node) => {
      if (!store.activeNodes.includes(draft.id)) return
      draft.pos.x += store.activeDxy.x
      draft.pos.y += store.activeDxy.y
    }),
    produce(store.nodes[store.rulerNodes[1]], (draft: Node) => {
      if (!store.activeNodes.includes(draft.id)) return
      draft.pos.x += store.activeDxy.x
      draft.pos.y += store.activeDxy.y
    }),
  ]

  const pts = [
    [a.pos.x + a.size.w / 2, a.pos.y + a.size.h / 2],
    [b.pos.x + b.size.w / 2, b.pos.y + b.size.h / 2],
    [a.pos.x + a.size.w / 2, b.pos.y + b.size.h / 2],
  ]

  const lines = [
    { num: "a", points: orderByXPos(pts[0], pts[1]), length: distanceBetweenPoints(a.pos.x, a.pos.y, b.pos.x, b.pos.y) }
  ]

  if (pts[0][0] !== pts[1][0] && pts[0][1] !== pts[1][1])
    lines.push(
      { num: "b", points: [pts[0], pts[2]], length: distanceBetweenPoints(a.pos.x, a.pos.y, a.pos.x, b.pos.y) },
      { num: "c", points: [pts[1], pts[2]], length: distanceBetweenPoints(b.pos.x, b.pos.y, a.pos.x, b.pos.y) }
    )

  return (
    <g transform={transform}>
      {lines.map(line => (
        <g key={line.num}>
          <line
            x1={line.points[0][0]}
            y1={line.points[0][1]}
            x2={line.points[1][0]}
            y2={line.points[1][1]}
            stroke='white'
            strokeOpacity={0.2}
          />
          <text
            x={(line.points[0][0] + line.points[1][0]) / 2}
            y={(line.points[0][1] + line.points[1][1]) / 2 + 6}
            textAnchor="middle"
            font-size="18"
            fill="white"
            fontWeight={"500"}
          >
            {(line.length / 10).toFixed(1)} ㎜
          </text>
        </g>
      ))}
    </g>
  )
}

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function orderByXPos(point1: any, point2: any) {
  if (point1.x < point2.x) {
    return [point1, point2];
  } else if (point1.x > point2.x) {
    return [point2, point1];
  } else {
    // If both points have the same x position, order by y position
    if (point1.y <= point2.y) {
      return [point1, point2];
    } else {
      return [point2, point1];
    }
  }
}
