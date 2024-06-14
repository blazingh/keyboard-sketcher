import { GetSnapLinesResult, defaultSnapLinesResult, getSnapLines } from '../lib/snap-lines'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import { temporal } from 'zundo';
import isDeepEqual from 'fast-deep-equal';
import { v4 as v4uuid } from "uuid";
import { normalizeAngle } from '../lib/nodes-utils';
import { arcsGhostNodes } from '../nodes/arc-group-node';

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
  selectable: boolean
}

export type TransformMatrix = {
  x: number, // x translation
  y: number, // y translation
  s: number // scale 
}

export type ArcState = {
  pos: Pos,
  switchCounts: [number, number, number, number], // [left, top, rigth, bottom]
  switchGaps: [number, number, number, number], // [left, top, rigth, bottom]
  radiuses: [number, number, number, number], // [left, top, rigth, bottom]
}

type State = {
  _hasHydrated: boolean,
  /** nodes include switch, controllers or any newly added item to the viewport */
  nodes: { [key: Node["id"]]: Node },

  /** points to mesure distance between nodes */
  rulerPoints: {
    nodeId: Node["id"]
    position: "tl" | "tr" | "br" | "bl" | "c"
  }[]

  /** arcState contain nodes spanned along the arc */
  arcState: ArcState,

  /** selected Node */
  activeNodes: Node["id"][],

  /** snapLines position */
  snapLines?: GetSnapLinesResult,

  /** current draged node x and y displacement, used to translate the selected nodes on pointer drag */
  activeDxy: { x: number, y: number }
  activeDisplacement: Pos
}

type Action = {
  setHasHydrated: (state: boolean) => void
  nodesArray: () => Node[]

  updateNodes: (newNodes: Node[]) => void
  addNodes: (nodes: Node[]) => Node["id"][]
  deleteNode: (id: Node["id"]) => void

  setActiveDisplacement: (displacement: Pos) => void

  updateArcState: (arc: ArcState) => void,
  appendGhostNodes: () => void,

  addActiveNode: (id: Node["id"]) => void
  removeActiveNode: (id: Node["id"]) => void
  toggleActiveNode: (id: Node["id"]) => void
  clearActiveNodes: () => void

  addRulerPoint: (point: State["rulerPoints"][number]) => void
  removeRulerPoint: (nodeId: Node["id"]) => void

  updateSnapLines: (target: Node) => void
  resetSnapLines: () => void

  moveActiveNodes: (displacement: Pos) => void
  deleteActiveNodes: () => void
  copyActivedNodes: (xy: [number, number]) => void
  flipActiveNodesHorizontally: () => void
  flipActiveNodesVertically: () => void

  resetState: (postReset?: () => void) => void
}

export const baseNodeState: Node = {
  id: "1", size: { w: 140, h: 140 }, pos: { x: 0, y: 0, r: 0 }, selectable: true
}

const initialNodes: { [key: Node["id"]]: Node } = {
  "1": { id: "1", size: { w: 140, h: 140 }, pos: { x: 750, y: 750, r: 0 }, selectable: true },
  "2": { id: "2", size: { w: 140, h: 140 }, pos: { x: 750, y: 850, r: 0 }, selectable: true },
  "4": { id: "4", size: { w: 140, h: 140 }, pos: { x: 850, y: 850, r: 0 }, selectable: true },
  "3": { id: "3", size: { w: 140, h: 140 }, pos: { x: 850, y: 750, r: 0 }, selectable: true }
}

export const initialStoreState: State = {
  _hasHydrated: false,
  nodes: initialNodes,
  rulerPoints: [],
  arcState: {
    pos: { x: 0, y: 0, r: 0 },
    switchCounts: [3, 0, 3, 0],
    switchGaps: [50, 0, 50, 0],
    radiuses: [1000, 0, 1000, 0]
  },
  activeNodes: [],
  snapLines: { ...defaultSnapLinesResult },
  activeDxy: { x: 0, y: 0 },
  activeDisplacement: { x: 0, y: 0, r: 0 },
}

export type EditorStoreType = State & Action
export const useEditorStore = create<EditorStoreType>()(
  persist(
    temporal((set, get) => ({
      ...initialStoreState,

      resetState: async (postReset) => {
        set({ ...initialStoreState, _hasHydrated: true })
        await new Promise(resolve => setTimeout(resolve, 500));
        if (postReset) postReset()
      },

      nodesArray: () => Object.values(get().nodes),
      updateArcState: (arc) => {
        set(produce((state: State) => {
          state.arcState = arc
        }))
      },
      appendGhostNodes: () => {
        const { activeNodes, addNodes, nodes, activeDisplacement } = get()
        activeNodes.map((nodeId) => {
          const arc = {
            ...get().arcState,
            pos: {
              x: nodes[nodeId].pos.x + activeDisplacement.x,
              y: nodes[nodeId].pos.y + activeDisplacement.y,
              r: nodes[nodeId].pos.r + activeDisplacement.r,
            }
          }
          const ghostNodesGroups = arcsGhostNodes(arc)
          ghostNodesGroups.forEach((ghostNodesGroup) => {
            addNodes(ghostNodesGroup.ghostNodes)
          })
        })
      },
      addNodes: (nodes) => {
        const ids: Node["id"][] = []
        set(produce((state: State) => {
          nodes.forEach(node => {
            const randId = v4uuid()
            state.nodes[randId] = { ...node, id: randId, selectable: true }
            ids.push(randId)
          });
        }))
        return ids
      },
      deleteNode: (id) => {
        get().removeRulerPoint(id)
        set(produce((state: State) => {
          const index = state.activeNodes.findIndex((a: string) => a === id)
          if (index !== -1) state.activeNodes.splice(index, 1)
          delete state.nodes[id]
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
      addRulerPoint: (point) => {
        const exists = get().rulerPoints.some(item => item.nodeId === point.nodeId);
        if (!exists)
          set(produce((state: State) => {
            if (state.rulerPoints.length > 2)
              state.rulerPoints.shift()
            state.rulerPoints.push(point)
          }))
        else
          set(produce((state: State) => {
            const index = state.rulerPoints.findIndex(item => item.nodeId === point.nodeId);
            state.rulerPoints[index].position = point.position
          }))
      },
      removeRulerPoint: (nodeId) => {
        set(produce((state: State) => {
          state.rulerPoints = state.rulerPoints.filter(point => point.nodeId !== nodeId)
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
            state.nodes[id].pos.r = normalizeAngle(Math.round((state.nodes[id].pos.r + r) / 5) * 5)
          })
        }))
      },
      deleteActiveNodes: () => {
        set(produce((state: State) => {
          get().activeNodes.forEach(id => {
            delete state.nodes[id]
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
      flipActiveNodesHorizontally: () => {
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
            draft.nodes[node.id].pos.r = 180 - draft.nodes[node.id].pos.r;
          }
        }))
      },
      flipActiveNodesVertically: () => {
        const nodes: Node[] = get().activeNodes.map(nodeId => get().nodes[nodeId])
        let minY = Infinity, maxY = -Infinity;
        for (const node of nodes) {
          minY = Math.min(minY, node.pos.y);
          maxY = Math.max(maxY, node.pos.y);
        }
        const centerY = (minY + maxY) / 2;
        set(produce((draft: State) => {
          for (const node of nodes) {
            draft.nodes[node.id].pos.y = centerY - (node.pos.y - centerY);
            draft.nodes[node.id].pos.r = 180 - draft.nodes[node.id].pos.r;
          }
        }))
      },
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      }

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
      version: 7,
      partialize: (state) => ({ nodes: state.nodes }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
