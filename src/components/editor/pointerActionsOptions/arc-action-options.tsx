import { useEditorStore } from "@/components/editor/stores/editor-store"
import { produce } from "immer"
import SimpleNumberInput from "@/components/simple-number-input"
import InputWithKeypad from "@/components/virtual-numpad-input";
import { useState } from "react";
import { Button, Slider, Select, SelectItem, Divider } from "@nextui-org/react";
import { PointerAcitonStore } from "../stores/pointer-actions-store";
import { arcsGhostNodes } from "../nodes/arc-group-node";

export default function ArcActionOptions({
}: {
  }) {

  const store = useEditorStore()

  const pointerAction = PointerAcitonStore()

  const [slider1Val, setSlider1Val] = useState<number>(0)
  const [slider2Val, setSlider2Val] = useState<number>(0)

  const arc = pointerAction.arcOptions

  return (
    <div className="flex flex-col gap-2">

      <span className="w-full text-center">
        Arc Options
      </span>

      <Divider />

      {/* arc side */}
      <Select
        label="Arc sides"
        size="sm"
        selectionMode="multiple"
        selectedKeys={new Set(arc.sides)}
        disallowEmptySelection
        onSelectionChange={(keys) => {
          pointerAction.updateArcOptions(produce(arc, draft => {
            draft.sides = Array.from(keys as any)
          }))
        }}
      >
        {["left", "right"].map((side) => (
          <SelectItem key={side}>
            {side}
          </SelectItem>
        ))}
      </Select>

      {/* nodes count */}
      <div className="flex flex-col gap-1 mb-1">
        <SimpleNumberInput
          size="sm"
          label={"Switches count"}
          defaultValue={String(arc.switchCount)}
          onNumberChange={(v) => {
            pointerAction.updateArcOptions(produce(arc, draft => {
              draft.switchCount = Math.max(0, v)
            }))
          }}
        />
      </div>

      {/* nodes spacing */}
      <div >
        <InputWithKeypad
          size="sm"
          label="Swtiches spacing"
          defaultValue={String(arc.switchGap)}
          onValueChange={(v) => {
            pointerAction.updateArcOptions(produce(arc, draft => {
              draft.switchGap = Math.max(0, parseInt(v))
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
            pointerAction.updateArcOptions(produce(arc, draft => {
              if (!(draft.switchGap === 0 && v < 0))
                draft.switchGap = Math.max(
                  0,
                  (draft.switchGap - slider2Val) + v
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
          size="sm"
          label="Arc radius"
          defaultValue={String(arc.radius)}
          onValueChange={(v) => {
            pointerAction.updateArcOptions(produce(arc, draft => {
              draft.radius = Math.max(0, parseInt(v))
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
            pointerAction.updateArcOptions(produce(arc, draft => {
              if (!(draft.radius === 0 && v < 0))
                draft.radius = Math.max(
                  0,
                  (draft.radius - slider1Val) + v
                )
              setSlider1Val(v)
            }))
          }}
          onChangeEnd={() => {
            setSlider1Val(0)
          }}
        />
      </div>


      <div className="w-full flex justify-between mt-2">

        {/* confirm button */}
        <Button
          fullWidth
          size="sm"
          color="primary"
          onClick={() => {
            store.activeNodes.map((nodeId) => {
              const { pos: { x, y, r } } = store.nodes[nodeId]
              const { x: dx, y: dy, r: dr } = store.activeDisplacement
              const arc = pointerAction.arcOptions
              const pos = {
                x: x + dx,
                y: y + dy,
                r: r + dr
              }
              const ghostNodesGroups = arcsGhostNodes(arc, pos)
              ghostNodesGroups.forEach((ghostNodesGroup) => {
                store.addNodes(ghostNodesGroup.ghostNodes)
              })
            })
            store.clearActiveNodes()
          }}
        >
          Add Nodes
        </Button>
      </div>

    </div>
  )
}
