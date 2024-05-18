import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { produce } from "immer"
import isDeepEqual from 'fast-deep-equal';
import { useViewportTransformationStore } from "./stores/viewport-transformation-store"

export default function NodesDuplicationTools({
}: {
  }) {
  const store = useEditorStore()
  const { transformMatrix } = useViewportTransformationStore()

  const { x: dx, y: dy, r: dr } = store.activeDisplacement
  const { x: tx, y: ty, s: ts } = transformMatrix

  if (false
    || !store.activeNodes
    || !isDeepEqual(store.activeDxy, { x: 0, y: 0 })
  ) return null

  const nodes: Node[] = store.activeNodes.map((nodeId) => {
    return produce(store.nodes[nodeId], draft => {
      draft.pos.x += dx
      draft.pos.y += dy
      draft.pos.r += dr
    })
  })

  const toolbarBox = findEnclosingBox(nodes)
  if (!toolbarBox) return null
  const { x, y, width: w, height: h } = toolbarBox

  return (
    <div
      className={cn(
        'absolute pointer-events-none *:pointer-events-auto ',
      )}
      style={{
        left: x * ts + tx,
        top: y * ts + ty,
        width: w * ts,
        height: h * ts
      }}
    >
      {/* left toolbar */}
      <div
        className='absolute -left-12 top-1/2 -translate-y-1/2 transition-all'
        style={{
          scale: `${ts}`
        }}
      >
        <Button
          className='w-8 h-8' onClick={() => store.copyActivedNodes([-w - 50, 0])}
        >
          <Plus className='shrink-0' />
        </Button>
      </div>
      {/* top toolbar */}
      <div
        className='absolute -top-12 left-1/2 -translate-x-1/2 transition-all'
        style={{
          scale: `${ts}`
        }}
      >
        <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([0, -h - 50])}>
          <Plus className='shrink-0' />
        </Button>
      </div>
      {/* right toolbar */}
      <div
        className='absolute -right-12 top-1/2 -translate-y-1/2 transition-all '
        style={{
          scale: `${ts}`
        }}
      >
        <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([w + 50, 0])}>
          <Plus className='shrink-0' />
        </Button>
      </div>
      {/* bottom toolbar */}
      <div
        className='absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all '
        style={{
          scale: `${ts}`
        }}
      >
        <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([0, h + 50])}>
          <Plus className='shrink-0' />
        </Button>
      </div>
    </div>
  )
}
