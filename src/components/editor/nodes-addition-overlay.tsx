import { Node, baseNodeState, useEditorStore } from "./stores/editor-store";
import { useGesture } from "@use-gesture/react";
import { produce } from "immer";
import { useEffect, useRef } from "react";

export default function NodesAdditionOverlay({ width, height }: { width: number, height: number }) {

  const store = useEditorStore()

  const ref = useRef<any>(!null)

  useEffect(() => {
    ref?.current?.focus()
  }, [])

  const bind = useGesture({
    onDragEnd: (e) => {
      if (!store.transformMatrix) return
      const node = baseNodeState
      const pos = {
        x: Math.round((e.xy[0] - store.transformMatrix.translateX) / store.transformMatrix.scaleX / 10) * 10 - node.size.w / 2,
        y: Math.round((e.xy[1] - store.transformMatrix.translateY) / store.transformMatrix.scaleY / 10) * 10 - node.size.h / 2,
      }
      store.addNodes([produce(node, (draft: Node) => {
        draft.pos = pos
      })])
      store.setEditorMode("normal")
    },
  })

  return (
    <g>
      <text
        x={width / 2}
        y={height / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={"2rem"}
        fill='white'
        className='select-none touch-none'
      >
        Click anywhere to add
      </text>
      <rect
        ref={ref}
        x={0}
        y={0}
        width={width}
        height={height}
        fill='black'
        fillOpacity={0.4}
        className='touch-none'
        {...bind()}
      />
    </g>
  )
}
