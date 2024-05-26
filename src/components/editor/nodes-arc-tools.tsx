import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { produce } from "immer"
import isDeepEqual from 'fast-deep-equal';
import { useViewportTransformationStore } from "./stores/viewport-transformation-store"
import SimpleNumberInput from "../simple-number-input"
import { HelperTooltip } from "../helper-tooltip"

export default function NodesArcTools({
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

  const arc = store.arcGroupsArray()[0]
  if (!arc) return null

  return (
    <div
      className={cn(
        'absolute pointer-events-none *:pointer-events-auto',
      )}
      style={{
        left: x * ts + tx,
        top: y * ts + ty,
        width: w * ts,
        height: h * ts
      }}
    >
      <div
        className='absolute -right-8 -bottom-8 translate-x-full translate-y-full flex flex-col p-4 gap-4 bg-secondary rounded w-[300px]'
        style={{
          transformBox: "fill-box",
          transformOrigin: "bottom right ",
          scale: `${ts + 0.1}`
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <label className="text-sm">Left switches count</label>
            <HelperTooltip desc={""} />
          </div>
          <SimpleNumberInput
            defaultValue={arc.switchCount[0]}
            onValueChange={(v) => {
              store.updateArcGroup(produce(arc, draft => {
                draft.switchCount[0] = v
              }))
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <label className="text-sm">Right switches count</label>
            <HelperTooltip desc={""} />
          </div>
          <SimpleNumberInput
            defaultValue={arc.switchCount[2]}
            onValueChange={(v) => {
              store.updateArcGroup(produce(arc, draft => {
                draft.switchCount[2] = v
              }))
            }}
          />
        </div>
      </div>
    </div>
  )
}
