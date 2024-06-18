import { cn } from "@/lib/utils";
import { EditorStoreType, Node, useEditorStore } from "./stores/editor-store";
import { pointsCenter, pointsDistance, rotatePoint } from "./lib/Pos-utils";

export function nodeEdges(node: Node, noCenter: boolean = false) {
  const edges = [
    { key: "tl", x: node.pos.x - node.size.w / 2, y: node.pos.y - node.size.h / 2 },
    { key: "tr", x: node.pos.x + node.size.w / 2, y: node.pos.y - node.size.h / 2 },
    { key: "br", x: node.pos.x + node.size.w / 2, y: node.pos.y + node.size.h / 2 },
    { key: "bl", x: node.pos.x - node.size.w / 2, y: node.pos.y + node.size.h / 2 },
  ];
  if (!noCenter) edges.push({ key: "c", x: node.pos.x, y: node.pos.y })
  return edges.map(edge => ({
    ...edge,
    ...rotatePoint({ ...edge, r: 0 }, node.pos)
  })) as {
    key: EditorStoreType["rulerPoints"][number]["position"]
    x: number,
    y: number
  }[]

}

export function NodesRulerLines() {
  const editor = useEditorStore()
  const pnts = function() {
    const arr: any[] = []
    editor.rulerPoints.forEach((point) => {
      const node = editor.nodes[point.nodeId]
      if (!node) return
      const positions = nodeEdges(
        editor.activeNodes.includes(node.id) ? {
          ...node,
          pos: {
            x: node.pos.x + editor.activeDisplacement.x,
            y: node.pos.y + editor.activeDisplacement.y,
            r: node.pos.r + editor.activeDisplacement.r,
          }
        } : node)
      const index = positions.findIndex(item => item.key === point.position);
      arr.push(positions[index])
    })
    if (arr.length === 3) arr.push(arr[0])
    return arr
  }()
  return (
    <g>
      {pnts.map((pnt, index) => {
        if (index === pnts.length - 1) return null
        const distance = (Math.round(pointsDistance(pnt, pnts[index + 1]) * 100) / 100).toFixed(1);
        const center = pointsCenter(pnt, pnts[index + 1])
        return (
          <g key={pnt.key + pnt.x + pnt.y}>
            <line x1={pnt.x} y1={pnt.y} x2={pnts[index + 1].x} y2={pnts[index + 1].y} className="stroke-white/50" />
            <text
              x={center.x}
              y={center.y}
              dominantBaseline="middle"
              textAnchor="middle"
              className="stroke-black fill-white font-bold"
              fontSize={14}
            >
              {distance}mm
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function NodesRulerPoints() {
  const editor = useEditorStore()

  return (
    <g>
      {editor.nodesArray().map((node) => {
        const positions = nodeEdges(node)
        return positions.map(pos => {
          const { x, y } = pos
          const selected = editor.rulerPoints.some(item => (item.nodeId === node.id && item.position === pos.key))
          return (
            <circle
              className={cn(
                'stroke-default hover:stroke-white fill-white hover:fill-primary cursor-pointer',
                selected && "fill-primary stroke-primary"
              )}
              key={node.id + pos.key}
              cx={x}
              cy={y}
              r={6}
              strokeWidth={1}
              onClick={() => {
                if (selected)
                  editor.removeRulerPoint(node.id)
                else
                  editor.addRulerPoint({ nodeId: node.id, position: pos.key })
              }}
            />
          )
        });
      })}
    </g>

  )
}
