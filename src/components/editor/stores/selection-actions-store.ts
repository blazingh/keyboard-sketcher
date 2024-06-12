import { create } from "zustand"
import { useEditorStore } from "./editor-store"


type State = {
  selectedMode: "move" | "copy" | "arc" | "flipH" | "flipV" | "delete"
}
type Action = {
  setSelectedMode: (mode: State["selectedMode"]) => void

  handleMirrorVer: () => void
  handleMirrorHor: () => void
  handleDelete: () => void

}

const initialState: State = {
  selectedMode: "move"
}

export type SelectionActionStoreType = State & Action
export const SelectionAcitonStore = create<SelectionActionStoreType>((set, get) => ({
  ...initialState,
  setSelectedMode: (mode) => {
    set({ selectedMode: mode })
  },
  handleMirrorVer: () => {
    const editor = useEditorStore()
    editor.flipActiveNodesVertically()
  },
  handleMirrorHor: () => {
    const editor = useEditorStore()
    editor.flipActiveNodesHorizontally()
  },
  handleDelete: () => {
    const editor = useEditorStore()
    editor.deleteActiveNodes()
  }
}))
