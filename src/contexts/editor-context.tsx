"use client";
import { Mcu } from "@/components/editor/nodes/mcu";
import { Outline } from "@/components/editor/nodes/outline";
import { Switch } from "@/components/editor/nodes/switch";
import { buttonVariants } from "@/components/ui/button";
import { initialNodes } from "@/constants/temp";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, PlusIcon } from 'lucide-react';
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { isMobile } from 'react-device-detect';
import { useHotkeys } from "react-hotkeys-hook";
import ReactFlow, { Background, BackgroundVariant, Node, NodeChange, NodeToolbar, Position, ReactFlowProvider, useNodesState, useOnSelectionChange } from "reactflow";
import { Key } from "ts-key-enum";
import 'reactflow/dist/style.css';
import { workSpaceContext } from "./workspace-context";

type EditorContext = {
  nodes: Node[]
  selectedNodes: string[]
  moveSelectedNodes: (dir: "U" | "D" | "L" | "R") => void
  duplicateSelectedNodes: (sid: Position) => void
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

  useOnSelectionChange({
    onChange: ({ nodes }: { nodes: Node[] }) => {
      setSelectedNodes(nodes.map((node) => node.id));
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

  function moveSelectedNodes(dir: "U" | "D" | "L" | "R") {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (dir === 'L') deltas = [-10, 0]
    if (dir === 'R') deltas = [10, 0]
    if (dir === 'U') deltas = [0, -10]
    if (dir === 'D') deltas = [0, 10]

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

  useHotkeys(Key.ArrowUp, () => moveSelectedNodes('U'))
  useHotkeys(Key.ArrowDown, () => moveSelectedNodes('D'))
  useHotkeys(Key.ArrowLeft, () => moveSelectedNodes('L'))
  useHotkeys(Key.ArrowRight, () => moveSelectedNodes('R'))

  return (
    <EditorContext.Provider
      value={{
        nodes,
        selectedNodes,
        moveSelectedNodes,
        duplicateSelectedNodes
      }}>
      {children}
      <ReactFlow
        snapToGrid
        fitView
        disableKeyboardA11y
        preventScrolling
        zoomOnScroll
        selectionOnDrag
        zoomOnDoubleClick={false}
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        maxZoom={5}
        snapGrid={[10, 10]}
        translateExtent={[[-2000, -2000], [2000, 2000]]}
        nodesDraggable={!isMobile}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        className="relative"
        onDoubleClick={() => workspace?.updateOption("openBar", "")}
      >
        <Background gap={10} variant={BackgroundVariant.Dots} />
        {/* switch move buttons */}
        {false && [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
        ].map((position) => (
          <NodeToolbar
            key={position}
            isVisible
            nodeId={selectedNodes}
            position={position}
            onClick={() => moveSelectedNodes('U')}
            className={cn(
              buttonVariants(),
              'p-0 h-8 w-8 flex items-center justify-center opacity-50 hover:opacity-100 z-10 ',
              position === Position.Top && "mt-8",
              position === Position.Bottom && "-mt-8",
              position === Position.Left && "ml-8",
              position === Position.Right && "-ml-8",
            )}
          >
            {position === Position.Top && (
              <ChevronUp className='w-6 h-6 flex-shrink-0' />
            )}
            {position === Position.Bottom && (
              <ChevronDown className='w-6 h-6 flex-shrink-0' />
            )}
            {position === Position.Left && (
              <ChevronLeft className='w-6 h-6 flex-shrink-0' />
            )}
            {position === Position.Right && (
              <ChevronRight className='w-6 h-6 flex-shrink-0' />
            )}
          </NodeToolbar>
        ))}

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
              'p-0 h-8 w-8 flex items-center justify-center opacity-50 hover:opacity-100',
              position === Position.Top && "-mt-2",
              position === Position.Bottom && "mt-2",
              position === Position.Left && "-ml-2",
              position === Position.Right && "ml-2",

            )}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </NodeToolbar>
        ))}
      </ReactFlow>
    </EditorContext.Provider>
  )

}
