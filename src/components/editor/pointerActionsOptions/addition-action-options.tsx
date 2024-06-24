import { Divider, Select, SelectItem } from "@nextui-org/react";
import { PointerAcitonStore } from "../stores/pointer-actions-store";
import { produce } from "immer";

export default function AdditonActionOptions({
}: {
  }) {
  const { additionOptions: TO, updateAdditionOptions } = PointerAcitonStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Addition Options
      </span>

      <Divider />

      <Select
        label="Node type"
        size="sm"
        selectionMode="single"
        selectedKeys={[TO.nodeType]}
        disallowEmptySelection
        onSelectionChange={(v) => {
          updateAdditionOptions(produce(TO, draft => {
            draft.nodeType = Array.from(v)[0] as any
          }))
        }}
      >
        {["switch", "mcu"].map((side) => (
          <SelectItem key={side}>
            {side}
          </SelectItem>
        ))}
      </Select>

    </div>
  )
}
