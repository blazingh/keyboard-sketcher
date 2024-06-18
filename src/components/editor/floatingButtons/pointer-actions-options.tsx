import { ScrollShadow } from "@nextui-org/react"
import NodesArcTools from "@/components/editor/nodes-arc-tools"
import NodesTranslationTools from "@/components/editor/nodes-translation-tools"
import { PointerAcitonStore } from "@/components/editor/stores/pointer-actions-store"
import ArcActionOptions from "../pointerActionsOptions/arc-action-options"

export default function PointerActionsOptions() {

  const pointer = PointerAcitonStore()

  return (
    <ScrollShadow className="w-[220px] max-h-[380px] relative p-2 bg-secondary border border-default  rounded-xl">

      {/* nodes translation toolbar */}
      {pointer.selectedMode === "normal" &&
        <NodesTranslationTools />
      }

      {/* nodes arc toolbar */}
      {pointer.selectedMode === "arc" &&
        <ArcActionOptions />
      }

    </ScrollShadow>
  )
}
