import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { Button } from "../ui/button"
import { PlusSquare } from "lucide-react"
import { produce } from "immer"
import isDeepEqual from 'fast-deep-equal';

export default function NodesDuplicationTools({
}: {
  }) {
  const store = useEditorStore()

  const { x: dx, y: dy, r: dr } = store.activeDisplacement

  if (false
    || store.activeNodes.length === 0
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
        'absolute pointer-events-none *:pointer-events-auto transition-all',
      )}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
      }}
    >
      {/* left toolbar */}
      <div
        className='absolute -left-14 top-1/2 -translate-y-1/2'
      >
        <Button
          variant={"ghost"}
          className="w-10 h-10"
          onClick={() => store.copyActivedNodes([-w - 50, 0])}
        >
          <PlusSquare className='shrink-0 w-10 h-10' />
        </Button>
      </div>
      {/* top toolbar */}
      <div
        className='absolute -top-14 left-1/2 -translate-x-1/2'
      >
        <Button
          variant={"ghost"}
          className="w-10 h-10"
          onClick={() => store.copyActivedNodes([0, -h - 50])}
        >
          <PlusSquare className='shrink-0 w-10 h-10' />
        </Button>
      </div>
      {/* right toolbar */}
      <div
        className='absolute -right-14 top-1/2 -translate-y-1/2'
      >
        <Button
          variant={"ghost"}
          className="w-10 h-10"
          onClick={() => store.copyActivedNodes([w + 50, 0])}
        >
          <PlusSquare className='shrink-0 w-10 h-10' />
        </Button>
      </div>
      {/* bottom toolbar */}
      <div
        className='absolute -bottom-14 left-1/2 -translate-x-1/2'
      >
        <Button
          variant={"ghost"}
          className="w-10 h-10"
          onClick={() => store.copyActivedNodes([0, h + 50])}>
          <PlusSquare className='shrink-0 w-10 h-10' />
        </Button>
      </div>
    </div>
  )
}
