import { ReactNode } from "react"
import { EditorStoreType } from "../stores/editor-store"
import { BoxSelect, Copy, DraftingCompass, MousePointer, Move, Plus, Ruler } from "lucide-react"

type selectionAction = {
  label: string
  description: string
  value: EditorStoreType["selectionAction"]
  icon: ReactNode
}

export const selcetionActionsOptions: selectionAction[] = [
  {
    label: "move",
    description: "translate and rotate items",
    value: "move",
    icon: <Move className="w-5 h-5" />
  },
  {
    label: "duplicate",
    description: "copy and duplicate nodes",
    value: "duplicate",
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
    description: "flip items horizontaly",
    value: "arc",
    icon: <DraftingCompass className="w-5 h-5" />
  },
  {
    label: "arc",
    description: "create nodes on an arc path",
    value: "arc",
    icon: <DraftingCompass className="w-5 h-5" />
  },
  {
    label: "arc",
    description: "create nodes on an arc path",
    value: "arc",
    icon: <DraftingCompass className="w-5 h-5" />
  },
]

type PointerAction = {
  label: string
  description: string
  value: EditorStoreType["pointerAction"]
  icon: ReactNode
}

export const pointerActionsOptions: PointerAction[] = [
  {
    label: "normal",
    description: "pan viewport and select items",
    value: "normal",
    icon: <MousePointer className="w-5 h-5" />
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
