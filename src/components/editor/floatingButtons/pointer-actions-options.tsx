import { ScrollShadow } from "@nextui-org/react"
import { PointerAcitonStore } from "@/components/editor/stores/pointer-actions-store"
import ArcActionOptions from "../pointerActionsOptions/arc-action-options"
import TransformationActionOptions from "../pointerActionsOptions/transformation-action-opitons"

export default function PointerActionsOptions() {

  const pointer = PointerAcitonStore()

  return (
    <ScrollShadow className="w-[250px] max-h-[380px] relative p-2 bg-secondary border border-default  rounded-xl">

      {/* nodes translation toolbar */}
      {pointer.selectedMode === "normal" &&
        <TransformationActionOptions />
      }

      {/* nodes arc toolbar */}
      {pointer.selectedMode === "arc" &&
        <ArcActionOptions />
      }

    </ScrollShadow>
  )
}
