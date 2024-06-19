import { useEditorStore } from "@/components/editor/stores/editor-store"
import { Divider, Select, SelectItem } from "@nextui-org/react";

export default function AdditonActionOptions({
}: {
  }) {
  const editor = useEditorStore()

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
        selectionMode="multiple"
        disallowEmptySelection
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
