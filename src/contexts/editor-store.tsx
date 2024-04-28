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

export type EditorStoreType = {
  nodes: Node[],
  setNodes: (newNodes: Node[]) => void
  updateNodes: (id: Node["id"], newNode: Node) => void
  activeNodes: Node["id"][],
  addActiveNodes: (id: Node["id"]) => void
  removeActiveNodes: (id: Node["id"]) => void
  snapLines?: GetSnapLinesResult
  updateSnapLines: (value: GetSnapLinesResult) => void
  resetSnapLines: () => void
}

const initialNodes: Node[] = [
  { id: "1", size: { w: 70, h: 70 }, pos: { x: 375, y: 375 } },
  { id: "2", size: { w: 70, h: 70 }, pos: { x: 30, y: 30 } },
  { id: "3", size: { w: 70, h: 70 }, pos: { x: 550, y: 50 } }
]

export const useEditorStore = create<EditorStoreType>((set, get) => ({
  nodes: initialNodes,
  activeNodes: [],
  snapLines: { ...defaultSnapLinesResult },
  updateNodes: (id: Node["id"], newNode: Node) => {
    const newNodes = [...get().nodes];
    const modNode = newNodes.find(a => a.id === id)
    if (!modNode) return
    modNode.pos = newNode.pos
    set({ nodes: newNodes })
  },
  setNodes: (newNodes: Node[]) => {
    set({ nodes: newNodes })
  },
  addActiveNodes: (id: Node["id"]) => {
    if (get().activeNodes.includes(id)) return
    set((p) => ({ activeNodes: [...p.activeNodes, id] }))
  },
  removeActiveNodes: (id: Node["id"]) => {
    if (!get().activeNodes.includes(id)) return
    set((p) => ({ activeNodes: p.activeNodes.filter(a => a !== id) }))
  },
  updateSnapLines: (value: GetSnapLinesResult) => {
    set({ snapLines: value })
  },
  resetSnapLines: () => {
    set({ snapLines: undefined })
  }
}))
