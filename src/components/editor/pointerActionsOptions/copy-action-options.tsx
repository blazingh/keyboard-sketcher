import InputWithKeypad from "@/components/virtual-numpad-input";
import { Divider, Switch } from "@nextui-org/react";
import { PointerAcitonStore } from "../stores/pointer-actions-store";
import { produce } from "immer";

export default function CopyActionOptions({
}: {
  }) {

  const { copyOptions: TO, updateCopyOptions } = PointerAcitonStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Copy Options
      </span>

      <Divider />

      <InputWithKeypad
        size="sm"
        label="Spacing"
        defaultValue={TO.spacing}
        endContent={<span className="text-xs italic">mm</span>}
        onValueChange={(v) => {
          updateCopyOptions(produce(TO, draft => {
            draft.spacing = v
          }))
        }}
      />

      <Switch
        size="sm"
        isSelected={TO.relativePosition}
        onValueChange={(v) => {
          updateCopyOptions(produce(TO, draft => {
            draft.relativePosition = v
          }))
        }}
      >
        Relative positioning
      </Switch>

    </div>
  )
}
