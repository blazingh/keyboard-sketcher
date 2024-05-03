import { GetSnapLinesResult, defaultSnapLinesResult, getSnapLines } from '@/lib/snap-lines'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { produce } from 'immer'
import { temporal } from 'zundo';
import crypto from 'crypto';
import isDeepEqual from 'fast-deep-equal';

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
  activeDxy: { x: number, y: number }
}

type Actions = {
  nodesInit: () => void,
  updateNodes: (newNodes: Node[]) => void

  setActiveDxy: (xy: { x: number, y: number }) => void

  addActiveNode: (id: Node["id"]) => void
  removeActiveNode: (id: Node["id"]) => void
  toggleActiveNode: (id: Node["id"]) => void
  clearActiveNodes: () => void

  updateSnapLines: (target: Node) => void
  resetSnapLines: () => void

  moveActiveNodes: (xy: [number, number]) => void
}

export type EditorStoreType = States & Actions

const initialNodes: { [key: Node["id"]]: Node } = {
  "1": { id: "1", size: { w: 140, h: 140 }, pos: { x: 370, y: 370 } },
  "2": { id: "2", size: { w: 140, h: 140 }, pos: { x: 30, y: 30 } },
  "4": { id: "4", size: { w: 140, h: 140 }, pos: { x: -200, y: -200 } },
  "3": { id: "3", size: { w: 140, h: 140 }, pos: { x: 550, y: 50 } }
}

export const useEditorStore = create<EditorStoreType>()(
  persist(
    temporal((set, get) => ({
      nodes: {},
      nodesArray: () => Object.values(get().nodes),
      activeNodes: [],
      snapLines: { ...defaultSnapLinesResult },
      activeDxy: { x: 0, y: 0 },

      setActiveDxy: (xy: { x: number, y: number }) => {
        set(produce((state: States) => {
          state.activeDxy = xy
        }))
      },

      nodesInit: () => {
        set({ nodes: initialNodes })
      },
      updateNodes: (newNodes: Node[]) => {
        set(produce((state: States) => {
          newNodes.forEach(newNode => {
            state.nodes[newNode.id] = newNode
          })
        }))
      },

      addActiveNode: (id: Node["id"]) => {
        set(produce((state: States) => {
          const index = state.activeNodes.findIndex(a => a === id)
          if (index === -1) state.activeNodes.push(id)
        }))
      },
      removeActiveNode: (id: Node["id"]) => {
        set(produce((state: States) => {
          const index = state.activeNodes.findIndex(a => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
        }))
      },
      toggleActiveNode: (id: Node["id"]) => {
        set(produce((state: States) => {
          const index = state.activeNodes.findIndex(a => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
          else state.activeNodes.push(id)
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
            state.nodes[id].pos.y += xy[1]
          })
        }))
      }
    }),
      {
        partialize: (state) => ({ nodes: state.nodes }),
        onSave: (_, state) => {
        },
        equality: (pastState, currentState) =>
          isDeepEqual(pastState, currentState),
      },
    ),
    {
      name: 'sketcher-nodes',
      skipHydration: true,
      version: 1,
      partialize: (state) => ({ nodes: state.nodes }),
      onRehydrateStorage: (state) => {
        if (JSON.stringify(state.nodes) === JSON.stringify({}))
          state.nodes = initialNodes
      }
      //storage: createJSONStorage(() => localStorage),
    }
  )
)
