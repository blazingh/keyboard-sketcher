import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { MoveHorizontal, MoveRight, MoveUp, MoveVertical, RotateCcw, RotateCw } from "lucide-react"
import { produce } from "immer"
import { useViewportTransformationStore } from "./stores/viewport-transformation-store"
import { useGesture } from "@use-gesture/react"
import { useState } from "react"

export default function NodesTranformationTools({
}: {
  }) {
  const store = useEditorStore()
  const { transformMatrix } = useViewportTransformationStore()

  const { x: dx, y: dy, r: dr } = store.activeDisplacement

  const bindsDragY = useGesture({
    onDrag: ({ movement }) => {
      const displacement = {
        x: Math.round((movement[0] / transformMatrix.s) / 10) * 10,
        y: Math.round((movement[1] / transformMatrix.s) / 10) * 10,
        r: 0
      }
      store.setActiveDisplacement(displacement)
    },
    onDragEnd: () => {
      store.setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }
  }, {
    drag: { axis: "y" }
  })

  const bindsDragX = useGesture({
    onDrag: ({ movement }) => {
      const displacement = {
        x: Math.round((movement[0] / transformMatrix.s) / 10) * 10,
        y: Math.round((movement[1] / transformMatrix.s) / 10) * 10,
        r: 0
      }
      store.setActiveDisplacement(displacement)
    },
    onDragEnd: () => {
      store.setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }
  }, {
    drag: { axis: "x" }
  })

  const bindsDragR = useGesture({
    onDrag: ({ movement }) => {
      const displacement = {
        x: Math.round((movement[0] / transformMatrix.s) / 10) * 10,
        y: Math.round((movement[1] / transformMatrix.s) / 10) * 10,
        r: 0
      }
      store.setActiveDisplacement(displacement)
    },
    onDragEnd: () => {
      store.setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }
  }, {
    drag: { axis: "y" }
  })


  const nodes: Node[] = store.activeNodes.map((nodeId) => {
    return produce(store.nodes[nodeId], draft => {
      draft.pos.x += store.activeDisplacement.x
      draft.pos.y += store.activeDisplacement.y
    })
  })

  const toolbarBox = findEnclosingBox(nodes)

  if (false
    || !store.activeNodes
    || !toolbarBox
  ) return null

  const { x, y, width: w, height: h } = toolbarBox

  return (
    <div
      className={cn(
        'absolute pointer-events-none',
      )}
      style={{
        left: x * transformMatrix.s + transformMatrix.x,
        top: y * transformMatrix.s + transformMatrix.y,
        width: w * transformMatrix.s,
        height: h * transformMatrix.s
      }}
    >
      {/* bottom left transaltion handels */}
      <div className='absolute top-1/2 -left-5 transition-all pointer-events-auto'>
        <MoveVertical
          className="h-14 w-14 absolute -translate-y-1/2 -translate-x-1/2 hover:cursor-grab active:cursor-grabbing touch-none active:stroke-primary"
          {...bindsDragY()}
        />
      </div>

      {/* bottom left transaltion handels */}
      <div className='absolute -bottom-5 left-1/2 transition-all pointer-events-auto'>
        <MoveHorizontal
          className="h-14 w-14 absolute -translate-y-1/2 -translate-x-1/2  hover:cursor-grab active:cursor-grabbing touch-none active:stroke-primary"
          {...bindsDragX()}
        />
      </div>

      {/* top rigth rotaion handle */}
      <div className='absolute -top-5 -right-10 transition-all flex items-start justify-start overflow-hidden h-5 w-14 rotate-45 '>
        <div className="absolute" {...bindsDragR()}>
          <RotateCw className="h-14 w-14 absolute" />
          <RotateCcw className="h-14 w-14 absolute" />
        </div>
      </div>
    </div>
  )
}
