import { Node, baseNodeState, useEditorStore } from "./stores/editor-store";
import { useGesture } from "@use-gesture/react";
import { produce } from "immer";
import { useEffect, useRef } from "react";
import { useViewportTransformationStore } from "./stores/viewport-transformation-store";

export default function NodesAdditionOverlay({ width, height }: { width: number, height: number }) {

  const store = useEditorStore()
  const { transformMatrix, setTransformMatrix, TransformMatrixStyle } = useViewportTransformationStore()

  const ref = useRef<any>(!null)

  useEffect(() => {
    ref?.current?.focus()
  }, [])

  const bind = useGesture({
    onDragEnd: (e) => {
      const node = baseNodeState
      const pos = {
        x: Math.round((e.xy[0] - transformMatrix.x) / transformMatrix.s / 10) * 10 - node.size.w / 2,
        y: Math.round((e.xy[1] - transformMatrix.y) / transformMatrix.s / 10) * 10 - node.size.h / 2,
        r: 0
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
