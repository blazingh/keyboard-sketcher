import { produce } from "immer"
import { create } from "zustand"


type State = {

  selectedMode: "normal" | "selectionBox" | "ruler" | "addition" | "copy" | "arc"

  arcOptions: {
    sides: ("left" | "right")[]
    switchCount: number
    switchGap: number
    radius: number
  }


}

type Action = {
  setSelectedMode: (mode: State["selectedMode"]) => void
  updateArcOptions: (arc: State["arcOptions"]) => void,
}

const initialState: State = {
  selectedMode: "normal",
  arcOptions: {
    sides: ["right"],
    switchCount: 5,
    switchGap: 50,
    radius: 1000
  }
}

export type PointerActionStoreType = State & Action
export const PointerAcitonStore = create<PointerActionStoreType>((set, get) => ({
  ...initialState,
  setSelectedMode: (mode) => {
    set({ selectedMode: mode })
  },
  updateArcOptions: (arcOptions) => {
    set(produce((state: State) => {
      state.arcOptions = arcOptions
    }))
  }
}))
