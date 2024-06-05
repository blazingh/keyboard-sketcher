import { ArcGroup, useEditorStore } from "./stores/editor-store"
import { produce } from "immer"
import isDeepEqual from 'fast-deep-equal';
import SimpleNumberInput from "../simple-number-input"
import { ArrowLeftSquare, ArrowRightSquare, Check, X } from "lucide-react";
import InputWithKeypad from "../virtual-numpad-input";
import { useState } from "react";
import { Tabs, Tab, Button, Slider } from "@nextui-org/react";

export default function NodesArcTools({
}: {
  }) {
  const store = useEditorStore()

  const [slider1Val, setSlider1Val] = useState<number>(0)
  const [slider2Val, setSlider2Val] = useState<number>(0)


  if (false
    || !store.activeNodes
    || !isDeepEqual(store.activeDxy, { x: 0, y: 0 })
  ) return null

  const arc = store.arcGroupsArray()[0]
  if (!arc) return null

  return (
    <div
      className='flex flex-col gap-6'
    >
      <Tabs
        aria-label="sides"
        defaultSelectedKey="left"
        color="primary"
        classNames={{
          panel: "p-0 m-0"
        }}
        fullWidth
      >
        {["left", "up", "right", "down"].map((side, index) => [0, 2].includes(index) && (
          <Tab
            key={side}
            title={function() {
              if (side === "left") return <ArrowLeftSquare />
              if (side === "right") return <ArrowRightSquare />
              return "A"
            }()}>
            <div className="flex flex-col gap-4">

              {/* nodes count */}
              <div className="flex flex-col gap-2">
                <SimpleNumberInput
                  label={"Switches count"}
                  defaultValue={String(arc.switchCounts[index])}
                  onNumberChange={(v) => {
                    store.updateArcGroup(produce(arc, draft => {
                      draft.switchCounts[index] = Math.max(0, v)
                    }))
                  }}
                />
              </div>

              {/* nodes spacing */}
              <div >
                <InputWithKeypad
                  label="Swtiches spacing"
                  defaultValue={String(arc.switchGaps[index])}
                  onValueChange={(v) => {
                    store.updateArcGroup(produce(arc, draft => {
                      draft.switchGaps[index] = Math.max(0, parseInt(v))
                    }))
                  }}
                />
                <Slider
                  value={slider2Val}
                  minValue={-100}
                  maxValue={100}
                  fillOffset={0}
                  step={5}
                  size="sm"
                  onChange={(v: any) => {
                    store.updateArcGroup(produce(arc, draft => {
                      if (!(draft.switchGaps[index] === 0 && v < 0))
                        draft.switchGaps[index] = Math.max(
                          0,
                          (draft.switchGaps[index] - slider2Val) + v
                        )
                      setSlider2Val(v)
                    }))
                  }}
                  onChangeEnd={() => {
                    setSlider2Val(0)
                  }}
                />
              </div>

              {/* arc radius */}
              <div >
                <InputWithKeypad
                  label="Arc radius"
                  defaultValue={String(arc.radiuses[index])}
                  onValueChange={(v) => {
                    store.updateArcGroup(produce(arc, draft => {
                      draft.radiuses[index] = Math.max(0, parseInt(v))
                    }))
                  }}
                />
                <Slider
                  value={slider1Val}
                  minValue={-1000}
                  maxValue={1000}
                  fillOffset={0}
                  step={10}
                  size="sm"
                  onChange={(v: any) => {
                    store.updateArcGroup(produce(arc, draft => {
                      if (!(draft.radiuses[index] === 0 && v < 0))
                        draft.radiuses[index] = Math.max(
                          0,
                          (draft.radiuses[index] - slider1Val) + v
                        )
                      setSlider1Val(v)
                    }))
                  }}
                  onChangeEnd={() => {
                    setSlider1Val(0)
                  }}
                />
              </div>

            </div>
          </Tab>
        ))}
      </Tabs>

      <div className="w-full flex justify-between">

        {/* cancel button */}
        <Button
          color="danger"
          isIconOnly
          onClick={() => {
            store.setPointerAction("normal")
            store.clearActiveNodes()
          }}
        >
          <X />
        </Button>

        {/* confirm button */}
        <Button
          color="primary"
          isIconOnly
          onClick={() => {
            const arcs: ArcGroup[] = []
            store.activeNodes.map((nodeId) => {
              arcs.push({
                ...store.arcGroups["nnn"],
                pos: {
                  x: store.nodes[nodeId].pos.x + store.activeDisplacement.x,
                  y: store.nodes[nodeId].pos.y + store.activeDisplacement.y,
                  r: store.nodes[nodeId].pos.r + store.activeDisplacement.r,
                }
              })
            })
            store.appendGhostNodes(arcs)
            store.setPointerAction("normal")
            store.setSelectionAction("move")
            store.clearActiveNodes()
          }}
        >
          <Check />
        </Button>
      </div>

    </div>
  )
}
