import { produce } from "immer"
import { create } from "zustand"


type State = {

  selectedMode: "normal" | "selectionBox" | "ruler" | "addition" | "copy" | "arc" | "flipH" | "flipV" | "delete"

  transformationOptions: {},

  selectionBoxOptions: {},

  rulerOptions: {},

  additionOptions: {},

  copyOptions: {},

  arcOptions: {
    sides: ("left" | "right")[]
    switchCount: number
    switchGap: number
    radius: number
  },

}

type Action = {
  setSelectedMode: (mode: State["selectedMode"]) => void
  updateTransformationOptions: (options: State["transformationOptions"]) => void,
  updateSelectionBoxOptions: (options: State["selectionBoxOptions"]) => void,
  updateRulerOptions: (options: State["rulerOptions"]) => void,
  updateAdditionOptions: (options: State["additionOptions"]) => void,
  updateCopyOptions: (options: State["copyOptions"]) => void,
  updateArcOptions: (options: State["arcOptions"]) => void,
}

const initialState: State = {
  selectedMode: "normal",
  transformationOptions: {},
  selectionBoxOptions: {},
  rulerOptions: {},
  additionOptions: {},
  copyOptions: {},
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
  updateTransformationOptions: (options) => {
    set(produce((state: State) => {
      state.transformationOptions = options
    }))
  },
  updateSelectionBoxOptions: (options) => {
    set(produce((state: State) => {
      state.selectionBoxOptions = options
    }))
  },
  updateRulerOptions: (options) => {
    set(produce((state: State) => {
      state.rulerOptions = options
    }))
  },
  updateAdditionOptions: (options) => {
    set(produce((state: State) => {
      state.additionOptions = options
    }))
  },
  updateCopyOptions: (options) => {
    set(produce((state: State) => {
      state.copyOptions = options
    }))
  },
  updateArcOptions: (options) => {
    set(produce((state: State) => {
      state.arcOptions = options
    }))
  },
}))
