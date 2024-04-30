import { GetSnapLinesResult, defaultSnapLinesResult, getSnapLines } from '@/lib/snap-lines'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { produce } from 'immer'
import { temporal } from 'zundo';
import crypto from 'crypto';

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

type States = {
  nodes: { [key: Node["id"]]: Node },
  snapLines?: GetSnapLinesResult,
  nodesArray: () => Node[],
  activeNodes: Node["id"][],
}

type Actions = {
  updateNodes: (id: Node["id"], newNode: Node) => void
  nodesInit: () => void,

  addActiveNodes: (id: Node["id"]) => void
  removeActiveNodes: (id: Node["id"]) => void
  clearActiveNodes: () => void

  updateSnapLines: (target: Node) => void
  resetSnapLines: () => void

  moveActiveNodes: (xy: [number, number]) => void
}

export type EditorStoreType = States & Actions

const initialNodes: { [key: Node["id"]]: Node } = {
  "1": { id: "1", size: { w: 70, h: 70 }, pos: { x: 375, y: 375 } },
  "2": { id: "2", size: { w: 70, h: 70 }, pos: { x: 30, y: 30 } },
  "3": { id: "3", size: { w: 70, h: 70 }, pos: { x: 550, y: 50 } }
}

export const useEditorStore = create<EditorStoreType>()(
  persist(
    temporal((set, get) => ({
      nodes: {},
      nodesArray: () => Object.values(get().nodes),
      activeNodes: [],
      snapLines: { ...defaultSnapLinesResult },

      nodesInit: () => {
        set({ nodes: initialNodes })
      },
      updateNodes: (id: Node["id"], newNode: Node) => {
        set(produce((state: States) => {
          state.nodes[id] = newNode
        }))
      },

      addActiveNodes: (id: Node["id"]) => {
        set(produce((state: States) => {
          const index = state.activeNodes.findIndex(a => a === id)
          if (index === -1) state.activeNodes.push(id)
        }))
      },
      removeActiveNodes: (id: Node["id"]) => {
        set(produce((state: States) => {
          const index = state.activeNodes.findIndex(a => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
        }))
      },
      clearActiveNodes: () => {
        set({ activeNodes: [] })
      },

      updateSnapLines: (target: Node) => {
        set({ snapLines: getSnapLines(target, get().nodesArray()) })
      },
      resetSnapLines: () => {
        set({ snapLines: undefined })
      },

      moveActiveNodes: (xy: [number, number]) => {
        set(produce((state: States) => {
          get().activeNodes.forEach(id => {
            state.nodes[id].pos.x += xy[0]
            state.nodes[id].pos.x += xy[1]
          })
        }))
      }
    }),
      {
        partialize: (state) => ({ nodes: state.nodes }),
      },
    ),
    {
      name: 'sketcher-nodes',
      skipHydration: true,
      partialize: (state) => ({ nodes: state.nodes }),
      onRehydrateStorage: (state) => {
        if (JSON.stringify(state.nodes) === JSON.stringify({}))
          state.nodes = initialNodes
      }
      //storage: createJSONStorage(() => localStorage),
    }
  )
)
