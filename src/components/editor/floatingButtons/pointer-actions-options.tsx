import { ScrollShadow } from "@nextui-org/react"
import { PointerAcitonStore } from "@/components/editor/stores/pointer-actions-store"
import ArcActionOptions from "../pointerActionsOptions/arc-action-options"
import TransformationActionOptions from "../pointerActionsOptions/transformation-action-opitons"
import SelectionBoxActionOptions from "../pointerActionsOptions/selectionBox-action-options"
import AdditonActionOptions from "../pointerActionsOptions/addition-action-options"
import CopyActionOptions from "../pointerActionsOptions/copy-action-options"
import RulerActionOptions from "../pointerActionsOptions/ruler-action-options"

export default function PointerActionsOptions() {

  const pointer = PointerAcitonStore()

  return (
    <ScrollShadow className="w-[250px] max-h-[380px] relative p-2 bg-secondary border border-default  rounded-xl">

      {/* nodes translation toolbar */}
      {pointer.selectedMode === "normal" &&
        <TransformationActionOptions />
      }

      {/* nodes selections box toolbar */}
      {pointer.selectedMode === "selectionBox" &&
        <SelectionBoxActionOptions />
      }

      {/* nodes addition toolbar */}
      {pointer.selectedMode === "addition" &&
        <AdditonActionOptions />
      }

      {/* nodes arc toolbar */}
      {pointer.selectedMode === "arc" &&
        <ArcActionOptions />
      }

      {/* nodes copy toolbar */}
      {pointer.selectedMode === "copy" &&
        <CopyActionOptions />
      }

      {/* editor ruler toolbar */}
      {pointer.selectedMode === "ruler" &&
        <RulerActionOptions />
      }

    </ScrollShadow>
  )
}
