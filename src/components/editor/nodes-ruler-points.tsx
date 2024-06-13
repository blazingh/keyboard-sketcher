import { cn } from "@/lib/utils";
import { useEditorStore } from "./stores/editor-store";

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
        return positions.map(pos => (
          <circle
            className={cn(
              'stroke-default hover:stroke-white fill-white hover:fill-primary cursor-pointer'
            )}
            key={node.id + pos.key}
            cx={pos.x}
            cy={pos.y}
            r={7}
            strokeWidth={2}
          />
        ));
      })}
    </g>

  )
}
