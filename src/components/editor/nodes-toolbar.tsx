import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { TransformMatrix } from "./editor-viewport"
import { produce } from "immer"
import isDeepEqual from 'fast-deep-equal';

export default function NodesToolbar({
  transformMatrix
}: {
  transformMatrix: TransformMatrix
}) {
  const store = useEditorStore()
  if (false
    || !store.activeNodes
    || !isDeepEqual(store.activeDxy, { x: 0, y: 0 })
  ) return null

  const nodes: Node[] = store.activeNodes.map((nodeId) => {
    return produce(store.nodes[nodeId], draft => {
      draft.pos = {
        x: draft.pos.x + store.activeDxy.x,
        y: draft.pos.y + store.activeDxy.y,
      }
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
        left: x * transformMatrix.scaleX + transformMatrix.translateX,
        top: y * transformMatrix.scaleY + transformMatrix.translateY,
        width: w * transformMatrix.scaleX,
        height: h * transformMatrix.scaleY
      }}
    >
      {/* left toolbar */}
      <div className='h-full absolute -left-12 top-1/2 -translate-y-1/2 transition-all flex items-center justify-center '>
        {store.editorMode === "copy" &&
          <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([-w - 50, 0])}>
            <Plus className='shrink-0' />
          </Button>
        }
      </div>
      {/* top toolbar */}
      <div className='w-full h-10 absolute -top-12 left-1/2 -translate-x-1/2 transition-all flex items-center justify-center '>
        {store.editorMode === "copy" &&
          <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([0, -h - 50])}>
            <Plus className='shrink-0' />
          </Button>
        }
      </div>
      {/* right toolbar */}
      <div className='h-full absolute -right-12 top-1/2 -translate-y-1/2 transition-all flex items-center justify-center '>
        {store.editorMode === "copy" &&
          <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([w + 50, 0])}>
            <Plus className='shrink-0' />
          </Button>
        }
      </div>
      {/* bottom toolbar */}
      <div className='w-full h-10 absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all flex items-center justify-center '>
        {store.editorMode === "copy" &&
          <Button className='w-8 h-8' onClick={() => store.copyActivedNodes([0, h + 50])}>
            <Plus className='shrink-0' />
          </Button>
        }
      </div>
    </div>
  )
}
