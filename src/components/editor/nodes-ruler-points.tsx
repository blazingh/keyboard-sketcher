import { cn } from "@/lib/utils";
import { useEditorStore } from "./stores/editor-store";
import { rotatePoint } from "./lib/Pos-utils";

export default function NodesRulerPoints() {
  const editor = useEditorStore()
  return (
    <g>
      {editor.nodesArray().map((node) => {
        const positions = [
          { key: "center", x: node.pos.x, y: node.pos.y },
          { key: "top-right", x: node.pos.x + node.size.w / 2, y: node.pos.y - node.size.h / 2 },
          { key: "bottom-left", x: node.pos.x - node.size.w / 2, y: node.pos.y + node.size.h / 2 },
          { key: "top-left", x: node.pos.x - node.size.w / 2, y: node.pos.y - node.size.h / 2 },
          { key: "bottom-right", x: node.pos.x + node.size.w / 2, y: node.pos.y + node.size.h / 2 },
        ];
        return positions.map(pos => {
          const { x, y } = rotatePoint({ ...pos, r: 0 }, node.pos)
          return (
            <circle
              className={cn(
                'stroke-default hover:stroke-white fill-white hover:fill-primary cursor-pointer'
              )}
              key={node.id + pos.key}
              cx={x}
              cy={y}
              r={7}
              strokeWidth={2}
            />
          )
        });
      })}
    </g>

  )
}
