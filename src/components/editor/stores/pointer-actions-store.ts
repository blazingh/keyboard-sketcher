import { create } from "zustand"


type State = {
  selectedMode: "normal" | "selectionBox" | "ruler" | "addition" | "copy" | "arc"
}

type Action = {
  setSelectedMode: (mode: State["selectedMode"]) => void
}

const initialState: State = {
  selectedMode: "normal"
}

export type PointerActionStoreType = State & Action
export const PointerAcitonStore = create<PointerActionStoreType>((set, get) => ({
  ...initialState,
  setSelectedMode: (mode) => {
    set({ selectedMode: mode })
  },
}))
