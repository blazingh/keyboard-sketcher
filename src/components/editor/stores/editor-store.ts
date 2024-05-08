import { GetSnapLinesResult, defaultSnapLinesResult, getSnapLines } from '../lib/snap-lines'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import { temporal } from 'zundo';
import isDeepEqual from 'fast-deep-equal';
import { TransformMatrix } from '../editor-viewport';
import { v4 as v4uuid } from "uuid";

export type Node = {
  id: string,
  size: {
    w: number,
    h: number
  }
  pos: {
    x: number,
    y: number,
  }
}

type State = {
  nodes: { [key: Node["id"]]: Node },
  snapLines?: GetSnapLinesResult,
  nodesArray: () => Node[],
  activeNodes: Node["id"][],
  rulerNodes: Node["id"][],
  rulerActive: boolean,
  activeDxy: { x: number, y: number }
  transformMatrix: TransformMatrix | null
  activeNodeAddition: null | Node
}

type Action = {
  updateNodes: (newNodes: Node[]) => void
  addNode: (node: Node) => Node["id"]
  deleteNode: (id: Node["id"]) => void

  activateNodeForAddition: (node: State["activeNodeAddition"], pos: Node["pos"] | null) => void

  setActiveDxy: (xy: { x: number, y: number }) => void

  setRulerState: (state: boolean) => void

  addActiveNode: (id: Node["id"]) => void
  removeActiveNode: (id: Node["id"]) => void
  toggleActiveNode: (id: Node["id"]) => void
  clearActiveNodes: () => void

  addRulerNode: (id: Node["id"]) => void
  removeRulerNode: (id: Node["id"]) => void
  toggleRulerNode: (id: Node["id"]) => void
  clearRulerNodes: () => void

  updateSnapLines: (target: Node) => void
  resetSnapLines: () => void

  moveActiveNodes: (xy: [number, number]) => void
  deleteActiveNodes: () => void

  setTransformMatrix: (matrix: TransformMatrix) => void
}

export type EditorStoreType = State & Action

export const baseNodeState: Node = {
  id: "1", size: { w: 140, h: 140 }, pos: { x: 0, y: 0 }
}

const initialNodes: { [key: Node["id"]]: Node } = {
  "1": { id: "1", size: { w: 140, h: 140 }, pos: { x: 30, y: 30 } },
  "2": { id: "2", size: { w: 140, h: 140 }, pos: { x: -160, y: -160 } },
  "4": { id: "4", size: { w: 140, h: 140 }, pos: { x: 30, y: -160 } },
  "3": { id: "3", size: { w: 140, h: 140 }, pos: { x: -160, y: 30 } }
}

export const useEditorStore = create<EditorStoreType>()(
  persist(
    temporal((set, get) => ({
      nodes: initialNodes,
      rulerActive: true,
      activeNodeAddition: null,

      setRulerState: (state) => {
        set({ rulerActive: state })
      },

      addNode: (node) => {
        const randId = v4uuid()
        set(produce((state: State) => {
          state.nodes[randId] = { ...node, id: randId }
        }))
        return randId
      },
      deleteNode: (id) => {
        set(produce((state: State) => {
          const index = state.activeNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
          delete state.nodes[id]
        }))
      },

      activateNodeForAddition: (node, pos) => {
        if (!pos && node) {
          set({ activeNodeAddition: node })
          return
        }
        const activeNode = get().activeNodeAddition
        if (pos && !node && activeNode) {
          get().addNode({ ...activeNode, pos: pos })
          set({ activeNodeAddition: null })
        }

      },

      nodesArray: () => Object.values(get().nodes),
      activeNodes: [],
      rulerNodes: [],

      snapLines: { ...defaultSnapLinesResult },
      activeDxy: { x: 0, y: 0 },
      transformMatrix: null,

      setActiveDxy: (xy) => {
        set(produce((state) => {
          state.activeDxy = xy
        }))
      },

      updateNodes: (newNodes) => {
        set(produce((state: State) => {
          newNodes.forEach(newNode => {
            state.nodes[newNode.id] = newNode
          })
        }))
      },

      addActiveNode: (id) => {
        set(produce((state: State) => {
          const index = state.activeNodes.findIndex((a: string) => a === id)
          if (index === -1) state.activeNodes.push(id)
        }))
      },
      removeActiveNode: (id) => {
        set(produce((state: State) => {
          const index = state.activeNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
        }))
      },
      toggleActiveNode: (id) => {
        set(produce((state: State) => {
          const index = state.activeNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
          else state.activeNodes.push(id)
        }))
      },
      clearActiveNodes: () => {
        set({ activeNodes: [] })
      },

      addRulerNode: (id) => {
        set(produce((state: State) => {
          const index = state.rulerNodes.findIndex((a: string) => a === id)
          if (index === -1) {
            if (state.rulerNodes.length > 1)
              state.rulerNodes = [state.rulerNodes[1], id]
            else
              state.rulerNodes.push(id)
          }
        }))
      },
      removeRulerNode: (id) => {
        set(produce((state: State) => {
          const index = state.rulerNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.rulerNodes.splice(index, 1)
        }))
      },
      toggleRulerNode: (id) => {
        set(produce((state: State) => {
          const index = state.rulerNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.rulerNodes.splice(index, 1)
          else {
            if (state.rulerNodes.length > 1)
              state.rulerNodes = [state.rulerNodes[1], id]
            else
              state.rulerNodes.push(id)
          }
        }))
      },
      clearRulerNodes: () => {
        set({ rulerNodes: [] })
      },

      updateSnapLines: (target) => {
        set({ snapLines: getSnapLines(target, get().nodesArray()) })
      },
      resetSnapLines: () => {
        set({ snapLines: undefined })
      },

      moveActiveNodes: (xy: [number, number]) => {
        set(produce((state: State) => {
          get().activeNodes.forEach(id => {
            state.nodes[id].pos.x += xy[0]
            state.nodes[id].pos.y += xy[1]
          })
        }))
      },
      deleteActiveNodes: () => {
        set(produce((state: State) => {
          get().activeNodes.forEach(id => {
            delete state.nodes[id]
            state.activeNodes = []
          })
        }))
      },

      setTransformMatrix(matrix) {
        set(produce((state: State) => {
          state.transformMatrix = matrix
        }))
      },
    }),
      {
        partialize: (state) => ({ nodes: state.nodes }),
        equality: (pastState, currentState) =>
          isDeepEqual(pastState, currentState),
      },
    ),
    {
      name: 'sketcher-nodes',
      skipHydration: true,
      version: 2,
      partialize: (state) => ({ nodes: state.nodes, transformMatrix: state.transformMatrix }),
    }
  )
)
