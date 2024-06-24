import { Button, ScrollShadow } from "@nextui-org/react"
import { PointerAcitonStore } from "@/components/editor/stores/pointer-actions-store"
import ArcActionOptions from "../pointerActionsOptions/arc-action-options"
import TransformationActionOptions from "../pointerActionsOptions/transformation-action-opitons"
import SelectionBoxActionOptions from "../pointerActionsOptions/selectionBox-action-options"
import AdditonActionOptions from "../pointerActionsOptions/addition-action-options"
import CopyActionOptions from "../pointerActionsOptions/copy-action-options"
import RulerActionOptions from "../pointerActionsOptions/ruler-action-options"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeftToLine, ArrowRightFromLine } from "lucide-react"

export default function PointerActionsOptions() {

  const [open, setOpen] = useState(true)
  const pointer = PointerAcitonStore()

  useEffect(() => {
    setOpen(true)
  }, [pointer.selectedMode])

  return (
    <div className="relative">
      <div className={cn(
        "transition-size overflow-hidden ease-in-out",
        open ? "w-[250px] " : "w-0",
      )}>
        <ScrollShadow
          className={cn(
            " w-[250px] max-h-[380px] p-2 bg-secondary border border-default rounded-xl"
          )}>

          <Button
            variant="faded"
            size="sm"
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              open ? " -right-4 " : "-right-8",
            )}
            isIconOnly
            onPress={() => { setOpen(p => !p) }}
          >
            {open
              ? <ArrowLeftToLine className="w-5 h-5" />
              : <ArrowRightFromLine className="w-5 h-5" />
            }
          </Button>

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
      </div>
    </div>
  )
}
