import { ReactNode } from "react"
import { EditorStoreType } from "../stores/editor-store"
import { BoxSelect, Copy, DraftingCompass, FlipHorizontal, FlipVertical, Hand, MousePointer, Move, Plus, Ruler, Trash2 } from "lucide-react"
import { SelectionActionStoreType } from "../stores/selection-actions-store"
import { PointerActionStoreType } from "../stores/pointer-actions-store"

type selectionAction = {
  label: string
  description: string
  value: SelectionActionStoreType["selectedMode"]
  icon: ReactNode
}

export const selectionActionsOptions: selectionAction[] = [
  {
    label: "move",
    description: "translate and rotate items",
    value: "move",
    icon: <Move className="w-5 h-5" />
  },
  {
    label: "duplicate",
    description: "copy and duplicate nodes",
    value: "copy",
    icon: <Copy className="w-5 h-5" />
  },
  {
    label: "arc",
    description: "create nodes on an arc path",
    value: "arc",
    icon: <DraftingCompass className="w-5 h-5" />
  },
  {
    label: "flip H",
    description: "flip items horizontally",
    value: "flipH",
    icon: <FlipHorizontal className="w-5 h-5" />
  },
  {
    label: "flip V",
    description: "flip items vertically",
    value: "flipV",
    icon: <FlipVertical className="w-5 h-5" />
  },
  {
    label: "delete",
    description: "delete selected items",
    value: "delete",
    icon: <Trash2 className="w-5 h-5 text-red-500" />
  },
]

type PointerAction = {
  label: string
  description: string
  value: PointerActionStoreType["selectedMode"]
  icon: ReactNode
}

export const pointerActionsOptions: PointerAction[] = [
  {
    label: "normal",
    description: "pan viewport and select items",
    value: "normal",
    icon: <Hand className="w-5 h-5" />
  },
  {
    label: "selection box",
    description: "batch select items",
    value: "selectionBox",
    icon: <BoxSelect className="w-5 h-5" />
  },
  {
    label: "measurement",
    description: "measure distance between points",
    value: "ruler",
    icon: <Ruler className="w-5 h-5" />
  },
  {
    label: "new item",
    description: "add items to the editor",
    value: "addition",
    icon: <Plus className="w-5 h-5" />
  },
]
