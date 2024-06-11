import { Button, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from "@nextui-org/react"
import NodesArcTools from "../nodes-arc-tools"
import { selectionActionsOptions } from "../constants/actions"
import { SelectionAcitonStore } from "../stores/selection-actions-store"
import { useState } from "react"
import { EditorStoreType, useEditorStore } from "../stores/editor-store"
import { cn } from "@/lib/utils"

const selector = (state: EditorStoreType) => ({
  activeNodes: state.activeNodes,
});

export default function SelectionActionFloatButtons() {
  const selectionAction = SelectionAcitonStore()
  const { activeNodes } = useEditorStore(selector)
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        activeNodes.length === 0 && "opacity-45 pointer-events-none"
      )}
    >

      {selectionActionsOptions.map((action) => (
        <Button
          key={action.value}
          variant={selectionAction.selectedMode === action.value ? "bordered" : "light"}
          color={selectionAction.selectedMode === action.value ? "primary" : "default"}
          isIconOnly
          size='sm'
          onPress={() => {
            if (["move", "copy", "arc"].includes(action.value)) {
              if (selectionAction.selectedMode === action.value)
                setOpen(p => !p)
              else
                setOpen(true)
              selectionAction.setSelectedMode(action.value)
            }
            if (action.value === "delete")
              selectionAction.handleDelete
            if (action.value === "flipV")
              selectionAction.handleMirrorVer
            if (action.value === "flipH")
              selectionAction.handleMirrorHor
          }}
        >
          {action.icon}
        </Button>
      ))}

      <Popover
        key={selectionAction.selectedMode}
        placement="left-end"
        shouldCloseOnInteractOutside={() => false}
        isOpen={activeNodes.length === 0 ? false : open}
        onOpenChange={setOpen}
        offset={14}
      >
        <PopoverTrigger>
          <div className="w-full">
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <ScrollShadow className="w-[260px] max-h-[380px] relative">
            {/* nodes arc toolbar */}
            {selectionAction.selectedMode === "arc" &&
              <NodesArcTools />
            }
          </ScrollShadow>
        </PopoverContent>
      </Popover>


    </div>
  )
}
