"use client";
import { Mcu } from "@/components/editor/nodes/mcu";
import { Outline } from "@/components/editor/nodes/outline";
import { Switch } from "@/components/editor/nodes/switch";
import { buttonVariants } from "@/components/ui/button";
import { initialNodes, initialOutlineNode } from "@/constants/temp";
import { cn } from "@/lib/utils";
import { PlusIcon } from 'lucide-react';
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { isMobile, isTablet } from 'react-device-detect';
import { useHotkeys } from "react-hotkeys-hook";
import ReactFlow, { Background, BackgroundVariant, Node, NodeChange, NodeToolbar, Position, ReactFlowProvider, useNodesState, useOnSelectionChange } from "reactflow";
import { Key } from "ts-key-enum";
import 'reactflow/dist/style.css';
import { workSpaceContext } from "./workspace-context";
import { calculateCenterPosition } from "@/lib/positions";
import NodesControll from "@/components/editor/node-controlls";
import "../components/editor/reactflow.css"

type EditorContext = {
  nodes: Node[]
  selectedNodes: string[]
  moveSelectedNodes: (dir: "X" | "Y", dis?: number) => void
  duplicateSelectedNodes: (sid: Position) => void
  store: {
    basePos: {
      x: number
      y: number
    }
  }
}

export const EditorContext = createContext<EditorContext | null>(null);

export function EditorContextProvider({ children }: { children: ReactNode }) {
  return (
    <ReactFlowProvider>
      <FlowEditorContextProvider>
        {children}
      </FlowEditorContextProvider>
    </ReactFlowProvider>
  )
}

export function FlowEditorContextProvider({ children }: any) {

  const nodeTypes = useMemo(() => ({ switch: Switch, mcu: Mcu, outline: Outline }), []);

  const [nodes, _, onNodesChange] = useNodesState(initialNodes);

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const workspace = useContext(workSpaceContext)

  const [store, setStore] = useState<EditorContext["store"]>({
    basePos: { x: 0, y: 0 }
  })

  function handleInit() {
    onNodesChange([{ type: "add", item: initialOutlineNode }])
  }

  function handleNodeChange(changes: NodeChange[]) {
    const modChanges = changes.map((node: NodeChange) => {
      if (
        node.type === "select"
        && workspace?.options.selectActive
        && selectedNodes.length !== changes.length
      ) {
        return { ...node, selected: true }
      }
      return node
    })
    onNodesChange(modChanges)
  }

  useOnSelectionChange({
    onChange: ({ nodes }: { nodes: Node[] }) => {
      setSelectedNodes(nodes.map((node) => node.id));
      const positions = nodes.map((node) => node.position)
      const center = calculateCenterPosition(positions)
      setStore(p => ({ ...p, basePos: center || { x: 0, y: 0 } }))
    },
  });

  function duplicateSelectedNodes(side: Position) {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (side === 'top') deltas = [0, -190]
    if (side === 'bottom') deltas = [0, 190]
    if (side === 'left') deltas = [-190, 0]
    if (side === 'right') deltas = [190, 0]
    nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return
      changes.push({
        type: 'select',
        id: node.id,
        selected: false
      })
      changes.push({
        type: 'add',
        item: {
          ...node,
          id: `${Math.random()}`,
          position: { x: node.position.x + deltas[0], y: node.position.y + deltas[1] },
          selected: true
        }
      })
    })
    onNodesChange(changes)
  }

  function moveSelectedNodes(dir: "X" | "Y", dis: number = 10) {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (dir === 'X') deltas = [dis, 0]
    if (dir === 'Y') deltas = [0, dis]

    const isMcu = nodes.find((node) => node.selected && node.type === 'mcu')
    if (isMcu && selectedNodes.length === 1) deltas = [deltas[0] * 0.5, deltas[1] * 0.5]

    nodes.map((node) => {
      if (!selectedNodes.includes(node.id)) return
      changes.push({
        type: 'position',
        id: node.id,
        position: { x: node.position.x + deltas[0], y: node.position.y + deltas[1] }
      })
    })

    onNodesChange(changes)
  }

  useHotkeys(Key.ArrowUp, () => moveSelectedNodes('Y', -10))
  useHotkeys(Key.ArrowDown, () => moveSelectedNodes('Y'))
  useHotkeys(Key.ArrowLeft, () => moveSelectedNodes('X', -10))
  useHotkeys(Key.ArrowRight, () => moveSelectedNodes('X'))

  return (
    <EditorContext.Provider
      value={{
        nodes,
        selectedNodes,
        moveSelectedNodes,
        duplicateSelectedNodes,
        store
      }}>
      <NodesControll />
      {children}
      <ReactFlow
        fitView
        snapToGrid
        disableKeyboardA11y
        zoomOnDoubleClick={false}
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        maxZoom={5}
        snapGrid={[10, 10]}
        translateExtent={[[-2000, -2000], [2000, 2000]]}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodeChange}
        onInit={handleInit}
      >
        <Background gap={10} variant={BackgroundVariant.Dots} />

        {/* switch add buttons */}
        {[
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
        ].map((position) => (
          <NodeToolbar
            isVisible
            key={position}
            nodeId={selectedNodes}
            position={position}
            onClick={() => duplicateSelectedNodes(position)}
            className={cn(
              buttonVariants(),
              'p-0 h-6 w-6 lg:h-8 lg:w-8 flex items-center justify-center opacity-50 hover:opacity-100',
              position === Position.Top && "mt-2",
              position === Position.Bottom && "-mt-2",
              position === Position.Left && "ml-2",
              position === Position.Right && "-ml-2",

            )}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </NodeToolbar>
        ))}
      </ReactFlow>
    </EditorContext.Provider>
  )

}
