import { Divider, Switch } from "@nextui-org/react";
import { PointerAcitonStore } from "../stores/pointer-actions-store";
import { produce } from "immer";

export default function TransformationActionOptions({
}: {
  }) {
  const { transformationOptions: TO, updateTransformationOptions } = PointerAcitonStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Transformation Options
      </span>

      <Divider />

      <Switch
        size="sm"
        isSelected={TO.displayPositions}
        onValueChange={(v) => {
          updateTransformationOptions(produce(TO, draft => {
            draft.displayPositions = v
          }))
        }}
      >
        Display Positions
      </Switch>

      <Switch
        size="sm"
        isSelected={TO.gridSnapingActive}
        onValueChange={(v) => {
          updateTransformationOptions(produce(TO, draft => {
            draft.gridSnapingActive = v
          }))
        }}
      >
        Enable grid snaping
      </Switch>

      <Switch
        size="sm"
        isSelected={TO.rotationSnapingActive}
        onValueChange={(v) => {
          updateTransformationOptions(produce(TO, draft => {
            draft.rotationSnapingActive = v
          }))
        }}
      >
        Enable rotation snaping
      </Switch>

      <Switch
        size="sm"
        isSelected={TO.relativeTransformation}
        onValueChange={(v) => {
          updateTransformationOptions(produce(TO, draft => {
            draft.relativeTransformation = v
          }))
        }}
      >
        Relative translation
      </Switch>


    </div>
  )
}
