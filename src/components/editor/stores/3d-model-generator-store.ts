import { ModelAOptionsTypes, ModelWorkerResult, modelADefaultOptionsValues } from "@/workers/model-a-options"
import { create } from "zustand"
import { Node } from "./editor-store"
import { produce } from "immer"

type ModelOptions = { type: "a" } & ModelAOptionsTypes

type State = {
  params: ModelOptions,
  worker: Worker | null
  generatedGeoms: ModelWorkerResult["geometries"]
}

type Action = {
  updateParam: <T extends keyof State["params"]>(key: T, value: State["params"][T]) => void,
  generateModel: (nodes: Node[]) => void,
  cancelModelGeneration: (id: number) => void,
}

const defaultState = {
  params: { type: "a", ...modelADefaultOptionsValues } as State["params"]
}

export type ThreeDModelGeneratorStoreType = State & Action

export const useThreeDModelGeneratorStore = create<ThreeDModelGeneratorStoreType>((set, get) => ({
  params: defaultState.params,
  worker: null,
  generatedGeoms: [],
  updateParam: (key, value) => {
    set(produce((state: State) => {
      if (state.params[key])
        state.params[key] = value
    }))
  },
  generateModel: (nodes) => {
    if (typeof window === 'undefined' || !window.Worker) return
    if (get().worker) {
      get().worker?.terminate()
      set({ worker: null })
    }
    const newWorker = new Worker(new URL("../../../workers/model-generator.ts", import.meta.url))
    newWorker.onmessage = (e: MessageEvent<any>) => {
      set(produce((state: State) => {
        state.generatedGeoms = e.data.geoms
        state.worker = null
      }))
    }
    newWorker.postMessage({ nodes: nodes, options: get().params })
    set({ worker: newWorker })
  },
  cancelModelGeneration: () => { }
}))
