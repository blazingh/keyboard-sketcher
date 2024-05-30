import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { produce } from "immer"
import isDeepEqual from 'fast-deep-equal';
import { useViewportTransformationStore } from "./stores/viewport-transformation-store"
import SimpleNumberInput from "../simple-number-input"
import { HelperTooltip } from "../helper-tooltip"
import { Button } from "../ui/button";
import { ArrowDownFromLine, ArrowLeftFromLine, ArrowLeftSquare, ArrowRightFromLine, ArrowRightLeft, ArrowRightSquare, ArrowUpFromLine, Check, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InputWithKeypad from "../virtual-numpad-input";

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
        className='absolute -right-8 -bottom-8 translate-x-full translate-y-full flex flex-col p-4 gap-8 bg-secondary rounded w-[300px]'
        style={{
          transformBox: "fill-box",
          transformOrigin: "bottom right ",
          scale: `${ts + 0.1}`
        }}
      >
        <Tabs defaultValue="left" className="w-full">
          <TabsList className="w-full grid grid-cols-2 py-0">
            <TabsTrigger value="left">
              <ArrowLeftSquare />
            </TabsTrigger>
            {/*
            <TabsTrigger value="up">
              <ArrowUpFromLine />
            </TabsTrigger>
            */}
            <TabsTrigger value="right">
              <ArrowRightSquare />
            </TabsTrigger>
            {/*
            <TabsTrigger value="down">
              <ArrowDownFromLine />
            </TabsTrigger>
            */}
          </TabsList>
          {["left", "up", "right", "down"].map((side, index) => (
            <TabsContent value={side} key={side} >
              <div className="flex flex-col gap-4 mt-4">

                <div className="flex flex-col gap-2">
                  <div className="flex items-end justify-between">
                    <label className="text-sm">switches count</label>
                    <HelperTooltip desc={""} />
                  </div>
                  <SimpleNumberInput
                    defaultValue={arc.switchCounts[index]}
                    onValueChange={(v) => {
                      store.updateArcGroup(produce(arc, draft => {
                        draft.switchCounts[index] = v
                      }))
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-end justify-between">
                    <label className="text-sm">Swithes gap</label>
                    <HelperTooltip desc={""} />
                  </div>
                  <InputWithKeypad
                    defaultValue={arc.switchGaps[index]}
                    onValueChange={(v) => {
                      store.updateArcGroup(produce(arc, draft => {
                        draft.switchGaps[index] = parseInt(v)
                      }))
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-end justify-between">
                    <label className="text-sm">Arc radius</label>
                    <HelperTooltip desc={""} />
                  </div>
                  <InputWithKeypad
                    defaultValue={arc.radiuses[index]}
                    onValueChange={(v) => {
                      store.updateArcGroup(produce(arc, draft => {
                        draft.radiuses[0] = parseInt(v)
                      }))
                    }}
                  />
                </div>

              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="w-full flex justify-between">
          <Button
            variant={"destructive"}
            size={"xs"}
            onClick={() => {
              store.setEditorMode("normal")
              store.clearActiveNodes()
            }}
          >
            <X />
          </Button>
          <Button size={"xs"}>
            <Check />
          </Button>
        </div>

      </div>
    </div>
  )
}
