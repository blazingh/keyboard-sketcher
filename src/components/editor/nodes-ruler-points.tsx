import { cn } from "@/lib/utils";
import { EditorStoreType, useEditorStore } from "./stores/editor-store";
import { rotatePoint } from "./lib/Pos-utils";

export default function NodesRulerPoints() {
  const editor = useEditorStore()

  return (
    <g>
      {editor.nodesArray().map((node) => {
        const positions: {
          key: EditorStoreType["rulerPoints"][number]["position"]
          x: number,
          y: number
        }[] = [
            { key: "c", x: node.pos.x, y: node.pos.y },
            { key: "tr", x: node.pos.x + node.size.w / 2, y: node.pos.y - node.size.h / 2 },
            { key: "bl", x: node.pos.x - node.size.w / 2, y: node.pos.y + node.size.h / 2 },
            { key: "tl", x: node.pos.x - node.size.w / 2, y: node.pos.y - node.size.h / 2 },
            { key: "br", x: node.pos.x + node.size.w / 2, y: node.pos.y + node.size.h / 2 },
          ];
        return positions.map(pos => {
          const { x, y } = rotatePoint({ ...pos, r: 0 }, node.pos)
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
              r={5}
              strokeWidth={2}
              onClick={() => {
                console.log(editor.rulerPoints)
                editor.addRulerPoint({ nodeId: node.id, position: pos.key })
              }}
            />
          )
        });
      })}
    </g>

  )
}
