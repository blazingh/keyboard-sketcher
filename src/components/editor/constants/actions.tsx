import { ReactNode } from "react"
import { EditorStoreType } from "../stores/editor-store"

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
    icon: null
  },
  {
    label: "duplicate",
    description: "copy and duplicate nodes",
    value: "duplicate",
    icon: null
  },
  {
    label: "arc",
    description: "create nodes on an arc path",
    value: "arc",
    icon: null
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
    icon: null
  },
  {
    label: "selection box",
    description: "batch select items",
    value: "selectionBox",
    icon: null
  },
  {
    label: "measurement",
    description: "measure distance between points",
    value: "ruler",
    icon: null
  },
  {
    label: "new item",
    description: "add items to the editor",
    value: "addition",
    icon: null
  },
]
