"use client";
import { HelperLinesRenderer } from "@/components/old_editor/helper-lines";
import NodesControll from "@/components/old_editor/node-controlls";
import { Mcu } from "@/components/old_editor/nodes/mcu";
import { Outline } from "@/components/old_editor/nodes/outline";
import { Switch } from "@/components/old_editor/nodes/switch";
import { buttonVariants } from "@/components/ui/button";
import { initialNodes, initialOutlineNode } from "@/constants/temp";
import { getHelperLines } from "@/lib/helpers-lines";
import { calculateCenterPosition } from "@/lib/positions";
import { cn } from "@/lib/utils";
import { without } from "lodash";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { isMobile, isTablet } from 'react-device-detect';
import { useHotkeys } from "react-hotkeys-hook";
import ReactFlow, { Background, BackgroundVariant, Node, NodeChange, NodeSelectionChange, NodeToolbar, Position, ReactFlowProvider, useNodesState, useStoreApi } from "reactflow";
import 'reactflow/dist/style.css';
import { Key } from "ts-key-enum";
import "../components/editor/reactflow.css";
import { workSpaceContext } from "./workspace-context";

type EditorContext = {
  nodes: Node[]
  selectedNodes: string[]
  moveSelectedNodes: (dir: "X" | "Y" | "XY", dis?: number | number[]) => void
  duplicateSelectedNodes: (sid: Position) => void
  deleteSelectedNodes: () => void
  unselectAllNodes: () => void
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

  const flowStore = useStoreApi()

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const workspace = useContext(workSpaceContext)

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number | undefined>(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<number | undefined>(undefined);

  const [store, setStore] = useState<EditorContext["store"]>({
    basePos: { x: 0, y: 0 },
  })

  function handleInit() {
    flowStore.setState({ multiSelectionActive: true })
    onNodesChange([{ type: "add", item: initialOutlineNode }])
  }

  function resetHelperLines() {
    setHelperLineHorizontal(undefined);
    setHelperLineVertical(undefined);
  }

  function setHelperLines(pos: any) {
    setHelperLineHorizontal(pos.horizontal);
    setHelperLineVertical(pos.vertical);
  }

  function handleNodeChange(changes: NodeChange[]) {
    const modChanges: NodeChange[] = []
    const selectionChanges: NodeSelectionChange[] = []
    resetHelperLines()
    changes.forEach((change: NodeChange) => {
      switch (change.type) {
        case "select":
          const modChange = change
          modChanges.push(modChange)
          selectionChanges.push(modChange)
          break;
        case "position":
          if (changes.length === 1 && change.dragging) {
            setHelperLines(getHelperLines(change, nodes))
          }
          modChanges.push(change)
          break
        default:
          modChanges.push(change)
          break;
      }
    })
    selectionChanges.forEach((change: NodeSelectionChange) => {
      if (change.selected && !selectedNodes.includes(change.id))
        setSelectedNodes(p => [...p, change.id])
      if (!change.selected && selectedNodes.includes(change.id))
        setSelectedNodes(p => without(p, change.id))
    })
    onNodesChange(modChanges)
  }

  function handleSelectionChange(nodesIds: string[]) {
    const newNodes = nodes.filter(node => nodesIds.includes(node.id))
    const positions = newNodes.map((node) => node.position)
    const center = calculateCenterPosition(positions)
    setStore(p => ({ ...p, basePos: center || { x: 0, y: 0 } }))
  }

  useEffect(() => {
    handleSelectionChange(selectedNodes)
  }, [selectedNodes])

  function deleteSelectedNodes() {
    const changes: NodeChange[] = []
    selectedNodes.forEach((nodeId) => {
      changes.push({ type: "remove", id: nodeId })
    })
    onNodesChange(changes)
  }

  function unselectAllNodes() {
    const changes: NodeChange[] = []
    selectedNodes.forEach((nodeId) => {
      changes.push({ type: "select", id: nodeId, selected: false })
    })
    handleNodeChange(changes)
  }

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

  function moveSelectedNodes(dir: "X" | "Y" | "XY", dis: number | number[] = 10) {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (dir === 'X' && typeof dis === "number") deltas = [dis, 0]
    if (dir === 'Y' && typeof dis === "number") deltas = [0, dis]
    if (dir === 'XY' && Array.isArray(dis)) deltas = [dis[0], dis[1]]

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
        deleteSelectedNodes,
        unselectAllNodes,
        store
      }}>
      <NodesControll />
      {children}
      <ReactFlow
        fitView
        snapToGrid
        disableKeyboardA11y
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        maxZoom={5}
        snapGrid={[10, 10]}

        selectionOnDrag
        zoomOnDoubleClick={false}
        panOnDrag={isMobile || isTablet ? true : [1, 2, 3, 4]}

        translateExtent={[[-2000, -2000], [2000, 2000]]}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodeChange}
        onInit={handleInit}

      >
        <Background gap={10} variant={BackgroundVariant.Dots} />

        <HelperLinesRenderer
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />

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
            onClick={() => {
              position === Position.Top && moveSelectedNodes("Y", -10)
              position === Position.Bottom && moveSelectedNodes("Y", 10)
              position === Position.Left && moveSelectedNodes("X", -10)
              position === Position.Right && moveSelectedNodes("X", 10)
            }}
            className={cn(
              buttonVariants(),
              'p-0 h-6 w-6 lg:h-8 lg:w-8 flex items-center justify-center opacity-50 hover:opacity-100',
              '*:w-5 *:h-5 *:flex-shrink-0',
            )}
          >
            {position === Position.Top && <ChevronUp />}
            {position === Position.Bottom && <ChevronDown />}
            {position === Position.Left && <ChevronLeft />}
            {position === Position.Right && <ChevronRight />}
          </NodeToolbar>
        ))}
      </ReactFlow>
    </EditorContext.Provider>
  )

}
