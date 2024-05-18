import { GetSnapLinesResult, defaultSnapLinesResult, getSnapLines } from '../lib/snap-lines'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import { temporal } from 'zundo';
import isDeepEqual from 'fast-deep-equal';
import { v4 as v4uuid } from "uuid";

export type Pos = {
  x: number,
  y: number,
  r: number,
}

export type Node = {
  id: string,
  pos: Pos
  size: {
    w: number,
    h: number
  }
}

export type TransformMatrix = {
  x: number, // x translation
  y: number, // y translation
  s: number // scale 
}

export type ArcGroup = {
  id: string,
  pos: Pos,
  switchCount: number,
  switchGap: number,
  radius: number
}

type State = {
  /* nodes include switch, controllers or any newly added item to the viewport */
  nodes: { [key: Node["id"]]: Node },
  nodesArray: () => Node[],

  /* arcGroup contain nodes spanned along the arc */
  arcGroups: { [key: ArcGroup["id"]]: ArcGroup },
  arcGroupsArray: () => ArcGroup[],

  /* selected Node */
  activeNodes: Node["id"][],
  /* Nodes to draw the ruler in between. max is 2  */
  rulerNodes: Node["id"][],

  /* diferent modes to handle different actions 
   * normal: allows user to pan the viewport, select nodes and move selected nodes
   * copy: allows user to pan the viewport, select nodes and copy selected nodes
   * select: allows user to use selection box
   * ruler: allows user to select points to measure distances
   * addition: draws an overlay and lets the user add a node
   */
  editorMode: "normal" | "copy" | "select" | "ruler" | "addition"

  /* snapLines position */
  snapLines?: GetSnapLinesResult,

  /* current draged node x and y displacement, used to translate the selected nodes on pointer drag */
  activeDxy: { x: number, y: number }
  activeDisplacement: Pos
}

type Action = {
  updateNodes: (newNodes: Node[]) => void
  addNodes: (nodes: Node[]) => Node["id"][]
  deleteNode: (id: Node["id"]) => void

  setActiveDxy: (xy: { x: number, y: number }) => void
  setActiveDisplacement: (displacement: Pos) => void

  updateArcGroup: (arc: ArcGroup) => void,

  setEditorMode: (mode: State["editorMode"]) => void

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

  moveActiveNodes: (displacement: Pos) => void
  deleteActiveNodes: () => void
  copyActivedNodes: (xy: [number, number]) => void
  flipActiveNodes: () => void

}

export const baseNodeState: Node = {
  id: "1", size: { w: 140, h: 140 }, pos: { x: 0, y: 0, r: 0 }
}

const initialNodes: { [key: Node["id"]]: Node } = {
  "1": { id: "1", size: { w: 140, h: 140 }, pos: { x: 30, y: 30, r: 0 } },
  "2": { id: "2", size: { w: 140, h: 140 }, pos: { x: -160, y: -160, r: 0 } },
  "4": { id: "4", size: { w: 140, h: 140 }, pos: { x: 30, y: -160, r: 0 } },
  "3": { id: "3", size: { w: 140, h: 140 }, pos: { x: -160, y: 30, r: 0 } }
}

export type EditorStoreType = State & Action
export const useEditorStore = create<EditorStoreType>()(
  persist(
    temporal((set, get) => ({
      nodes: initialNodes,
      editorMode: "normal",
      activeNodeAddition: null,

      arcGroups: {
        "nnn": {
          id: "nnn",
          pos: { x: 0, y: 0, r: 0 },
          switchCount: 4,
          switchGap: 50,
          radius: 500
        }
      },
      arcGroupsArray: () => Object.values(get().arcGroups),

      updateArcGroup: (arc) => {
        set(produce((state: State) => {
          state.arcGroups[arc.id] = arc
        }))
      },

      setEditorMode: (mode) => {
        set({ editorMode: mode })
      },

      addNodes: (nodes) => {
        const ids: Node["id"][] = []
        set(produce((state: State) => {
          nodes.forEach(node => {
            const randId = v4uuid()
            state.nodes[randId] = { ...node, id: randId }
            ids.push(randId)
          });
        }))
        return ids
      },
      deleteNode: (id) => {
        set(produce((state: State) => {
          const index = state.activeNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
          delete state.nodes[id]
        }))
      },

      nodesArray: () => Object.values(get().nodes),
      activeNodes: [],
      rulerNodes: [],

      snapLines: { ...defaultSnapLinesResult },
      activeDxy: { x: 0, y: 0 },
      activeDisplacement: { x: 0, y: 0, r: 0 },

      setActiveDxy: (xy) => {
        set(produce((state) => {
          state.activeDxy = xy
        }))
      },
      setActiveDisplacement: (displacement) => {
        set(produce((state) => {
          state.activeDisplacement = displacement
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

      moveActiveNodes: (displacement) => {
        const { x, y, r } = displacement
        set(produce((state: State) => {
          get().activeNodes.forEach(id => {
            state.nodes[id].pos.x = Math.round((state.nodes[id].pos.x + x) / 10) * 10
            state.nodes[id].pos.y = Math.round((state.nodes[id].pos.y + y) / 10) * 10
            state.nodes[id].pos.r = Math.round((state.nodes[id].pos.r + r) / 5) * 5
          })
        }))
      },
      deleteActiveNodes: () => {
        set(produce((state: State) => {
          get().activeNodes.forEach(id => {
            delete state.nodes[id]
            const index = state.rulerNodes.findIndex((a: string) => a === id)
            if (index !== -1) state.rulerNodes.splice(index, 1)
          })
          state.activeNodes = []
        }))
      },
      copyActivedNodes: (xy) => {
        const nodes: Node[] = []
        get().activeNodes.forEach(node => {
          nodes.push(produce(get().nodes[node], (draft: Node) => {
            draft.pos.x += xy[0]
            draft.pos.y += xy[1]
          }))
        })
        const newIds = get().addNodes(nodes)
        set({ activeNodes: newIds })
      },
      flipActiveNodes: () => {
        const nodes: Node[] = get().activeNodes.map(nodeId => get().nodes[nodeId])
        let minX = Infinity, maxX = -Infinity;
        for (const node of nodes) {
          minX = Math.min(minX, node.pos.x);
          maxX = Math.max(maxX, node.pos.x);
        }
        const centerX = (minX + maxX) / 2;
        set(produce((draft: State) => {
          for (const node of nodes) {
            draft.nodes[node.id].pos.x = centerX - (node.pos.x - centerX);
          }
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
      version: 4,
      partialize: (state) => ({ nodes: state.nodes }),
    }
  )
)
