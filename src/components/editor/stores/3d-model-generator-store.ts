import { ModelAOptionsTypes, modelADefaultOptionsValues } from "@/workers/model-a-options"
import { create } from "zustand"
import { Node } from "./editor-store"
import { produce } from "immer"

type ModelOptions = { type: "a" } & ModelAOptionsTypes

type State = {
  params: ModelOptions,
}

type Action = {
  updateParam: <T extends keyof State["params"]>(key: T, value: State["params"][T]) => void,
  generateModel: (nodes: Node[]) => void,
  cancelModelGeneration: (id: number) => void,
}

const defaultState: State = {
  params: { type: "a", ...modelADefaultOptionsValues }
}

export type ThreeDModelGeneratorStoreType = State & Action

export const useThreeDModelGeneratorStore = create<ThreeDModelGeneratorStoreType>((set, get) => ({
  params: defaultState.params,
  updateParam: (key, value) => {
    set(produce((state: State) => {
      if (state.params[key])
        state.params[key] = value
    }))
  },
  generateModel: (nodes) => { },
  cancelModelGeneration: () => { }
}))
