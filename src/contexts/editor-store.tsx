import { GetSnapLinesResult, defaultSnapLinesResult } from '@/lib/snap-lines'
import { create } from 'zustand'

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

  addActiveNodes: (id: Node["id"]) => void
  removeActiveNodes: (id: Node["id"]) => void
  clearActiveNodes: () => void

  updateSnapLines: (value: GetSnapLinesResult) => void
  resetSnapLines: () => void
}

export type EditorStoreType = States & Actions

const initialNodes: { [key: Node["id"]]: Node } = {
  "1": { id: "1", size: { w: 70, h: 70 }, pos: { x: 375, y: 375 } },
  "2": { id: "2", size: { w: 70, h: 70 }, pos: { x: 30, y: 30 } },
  "3": { id: "3", size: { w: 70, h: 70 }, pos: { x: 550, y: 50 } }
}

export const useEditorStore = create<EditorStoreType>((set, get) => ({
  nodes: initialNodes,
  nodesArray: () => Object.values(get().nodes),
  activeNodes: [],
  snapLines: { ...defaultSnapLinesResult },

  updateNodes: (id: Node["id"], newNode: Node) => {
    set(p => ({ nodes: { ...p.nodes, [id]: newNode } }))
  },

  addActiveNodes: (id: Node["id"]) => {
    if (get().activeNodes.includes(id)) return
    set((p) => ({ activeNodes: [...p.activeNodes, id] }))
  },
  removeActiveNodes: (id: Node["id"]) => {
    if (!get().activeNodes.includes(id)) return
    set((p) => ({ activeNodes: p.activeNodes.filter(a => a !== id) }))
  },
  clearActiveNodes: () => {
    set({ activeNodes: [] })
  },

  updateSnapLines: (value: GetSnapLinesResult) => {
    set({ snapLines: value })
  },
  resetSnapLines: () => {
    set({ snapLines: undefined })
  }
}))
