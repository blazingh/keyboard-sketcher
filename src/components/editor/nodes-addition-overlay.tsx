import { Node, baseNodeState, useEditorStore } from "./stores/editor-store";
import { useGesture } from "@use-gesture/react";
import { produce } from "immer";
import { useEffect, useRef } from "react";
import { PointerAcitonStore } from "./stores/pointer-actions-store";
import { useTransformContext } from "react-zoom-pan-pinch";

export default function NodesAdditionOverlay({ width, height }: { width: number, height: number }) {

  const store = useEditorStore()
  const pointerAction = PointerAcitonStore()
  const { transformState: { scale, positionX, positionY } } = useTransformContext()

  const ref = useRef<any>(!null)

  useEffect(() => {
    ref?.current?.focus()
  }, [])

  const bind = useGesture({
    onDragEnd: (e) => {
      const node = baseNodeState
      const pos = {
        x: Math.round((e.xy[0] - positionX) / scale / 10) * 10,
        y: Math.round((e.xy[1] - positionY) / scale / 10) * 10,
        r: 0
      }
      store.addNodes([produce(node, (draft: Node) => {
        draft.pos = pos
      })])
      pointerAction.setSelectedMode("normal")
    },
  })

  return (
    <g>
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
