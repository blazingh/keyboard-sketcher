import { Divider, Switch } from "@nextui-org/react";
import { PointerAcitonStore } from "../stores/pointer-actions-store";
import { produce } from "immer";

export default function SelectionBoxActionOptions({
}: {
  }) {
  const { selectionBoxOptions: TO, updateSelectionBoxOptions } = PointerAcitonStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Selection Options
      </span>

      <Divider />

      <Switch
        size="sm"
        isSelected={TO.includeSwitches}
        onValueChange={(v) => {
          updateSelectionBoxOptions(produce(TO, draft => {
            draft.includeSwitches = v
          }))
        }}
      >
        Include Switches
      </Switch>

      <Switch
        size="sm"
        isSelected={TO.includControllers}
        onValueChange={(v) => {
          updateSelectionBoxOptions(produce(TO, draft => {
            draft.includControllers = v
          }))
        }}
      >
        Include Controllers
      </Switch>

    </div>
  )
}
