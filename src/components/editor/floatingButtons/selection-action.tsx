import { Button, Popover, PopoverContent, PopoverTrigger, ScrollShadow } from "@nextui-org/react"
import NodesArcTools from "../nodes-arc-tools"
import { selectionActionsOptions } from "../constants/actions"
import { SelectionAcitonStore } from "../stores/selection-actions-store"
import { useState } from "react"
import { EditorStoreType, useEditorStore } from "../stores/editor-store"
import { cn } from "@/lib/utils"

const selector = (state: EditorStoreType) => ({
  activeNodes: state.activeNodes,
  deleteActiveNodes: state.deleteActiveNodes,
  flipActiveNodesHorizontally: state.flipActiveNodesHorizontally,
  flipActiveNodesVertically: state.flipActiveNodesVertically
});

export default function SelectionActionFloatButtons() {
  const selectionAction = SelectionAcitonStore()
  const { activeNodes, deleteActiveNodes, flipActiveNodesVertically, flipActiveNodesHorizontally } = useEditorStore(selector)
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
      )}
    >

      <Popover
        key={selectionAction.selectedMode}
        placement="right-start"
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
          <ScrollShadow className="w-[220px] max-h-[380px] relative">
            {/* nodes arc toolbar */}
            {selectionAction.selectedMode === "arc" &&
              <NodesArcTools />
            }
          </ScrollShadow>
        </PopoverContent>
      </Popover>

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
              deleteActiveNodes()
            if (action.value === "flipV")
              flipActiveNodesVertically()
            if (action.value === "flipH")
              flipActiveNodesHorizontally()
          }}
        >
          {action.icon}
        </Button>
      ))}

    </div>
  )
}
