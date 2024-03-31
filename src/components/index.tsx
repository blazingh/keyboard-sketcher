"use client";
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node,
  NodeChange,
  NodeProps,
  NodeToolbar,
  Position,
  ReactFlowProvider,
  useNodesState,
} from 'reactflow';

import { signal } from "@preact/signals-react";
import { InfoIcon, Option, PencilRuler, PlusIcon, Settings, Settings2 } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import { Key } from 'ts-key-enum';
import EditorDialogTrigger from './modals/editor-info';
import { Button, buttonVariants } from './ui/button';

type WorkerSignal = {
  status: 'pending' | 'resolved' | 'rejected',
  worker: Worker,
  startTime: Date,
  resolver: any,
  rejecter: any
}

type WorkersSignal = {
  [key: number]: WorkerSignal
}

const workersSigals = signal<WorkersSignal>({});

const initialNodes: Node[] = [
  { id: "1", type: 'mcu', position: { x: 190, y: 130 }, data: { label: 'mcu', rotation: '0', width: 220, height: 520 }, zIndex: 0 },
  { id: "2", type: 'switch', position: { x: 0, y: 0 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "3", type: 'switch', position: { x: 190, y: 0 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "4", type: 'switch', position: { x: 380, y: 0 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "5", type: 'switch', position: { x: 0, y: 190 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "6", type: 'switch', position: { x: 190, y: 190 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "7", type: 'switch', position: { x: 380, y: 190 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "8", type: 'switch', position: { x: 0, y: 380 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "9", type: 'switch', position: { x: 190, y: 380 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
  { id: "10", type: 'switch', position: { x: 380, y: 380 }, data: { label: 'Switch', rotation: '0', width: 140, height: 140 }, zIndex: 10 },
];

export default function Sketcher() {
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  return (
    <ReactFlowProvider>
      <div className={cn(
        "fixed h-svh z-30 top-0 left-0 bg-background rounded-r-2xl transition-all border-r-2 border-primary ease-in-out",
        settingsOpen ? "w-[280px] shadow-xl" : "w-0 shadow-none"
      )}
      >
        <Button
          onClick={() => setSettingsOpen(p => !p)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 right-0 transition-all ease-in-out py-6',
            settingsOpen ? "translate-x-1/2 px-1.5" : "translate-x-full rounded-l-none"
          )}
        >
          <Settings2 className='w-5 h-5' />
        </Button>
      </div>
      <div className={cn(
        "fixed h-svh z-30 top-0 right-0 bg-background rounded-l-2xl transition-all border-l-2 border-primary ease-in-out",
        editOpen ? "w-[280px] shadow-xl" : "w-0 shadow-none"
      )}
      >
        <Button
          onClick={() => setEditOpen(p => !p)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 left-0 transition-all ease-in-out py-6',
            editOpen ? "-translate-x-1/2 px-1.5" : "-translate-x-full rounded-r-none"
          )}
        >
          <PencilRuler className='w-5 h-5' />
        </Button>
      </div>
      <BasicFlow />
    </ReactFlowProvider >
  );
}

function BasicFlow() {

  const nodeTypes = useMemo(() => ({ switch: Switch, mcu: MCU }), []);
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);

  const selectedNodes = useMemo(() => {
    return nodes.filter((node) => node.selected).map((node) => node.id)
  }, [nodes])

  function handleAddNode(side: Position) {
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

  function handleMoveNode(key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown') {
    const changes: NodeChange[] = []
    let deltas = [0, 0]
    if (key === 'ArrowLeft') deltas = [-10, 0]
    if (key === 'ArrowRight') deltas = [10, 0]
    if (key === 'ArrowUp') deltas = [0, -10]
    if (key === 'ArrowDown') deltas = [0, 10]
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

  function handleCancelGeneration(id: number) {
    if (typeof window === 'undefined' || !window.Worker) return
    if (!workersSigals.value[id].worker) {
      toast.warning("Lost model worker :(")
      return
    }
    if (workersSigals.value[id].status !== 'pending') {
      toast.warning("Model Generation Already Resolved :|")
      return
    }
    workersSigals.value[id].worker.terminate()
    console.log(workersSigals.value[id])
    workersSigals.value[id].status = 'rejected'
    workersSigals.value[id].rejecter()
    toast("Model Generation Cancelled")
  }

  function handleGenerateModel() {
    if (typeof window === 'undefined' || !window.Worker) return
    const id = Math.random()
    const newWorker = new Worker(new URL("../workers/model-generator.ts", import.meta.url))
    newWorker.onmessage = (e: MessageEvent<any>) => {
      workersSigals.value[e.data.id].resolver({
        totalTime: Date.now() - workersSigals.value[e.data.id].startTime.getTime()
      })
      workersSigals.value[e.data.id].status = 'resolved'
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob(e.data.rawData as any))
      a.download = 'model.3mf'
      a.click()
      a.remove()
    };
    newWorker.postMessage(JSON.stringify({ nodes: nodes, id: id }))
    toast.promise(
      new Promise((resolve, reject) =>
        workersSigals.value[id] = {
          worker: newWorker,
          status: 'pending',
          startTime: new Date(),
          resolver: resolve,
          rejecter: reject,
        }
      ),
      {
        loading: "Generating Model...",
        description: new Date().toLocaleString(),
        success: (data: any) => `Model Generated in ${data.totalTime / 1000}s`,
        action: {
          label: "Cancel",
          onClick: () => handleCancelGeneration(id)
        },
      }
    )
  }

  /* hot keys event handlers */
  useHotkeys(Key.ArrowUp, () => handleMoveNode('ArrowUp'))
  useHotkeys(Key.ArrowDown, () => handleMoveNode('ArrowDown'))
  useHotkeys(Key.ArrowLeft, () => handleMoveNode('ArrowLeft'))
  useHotkeys(Key.ArrowRight, () => handleMoveNode('ArrowRight'))

  return (
    <div className='w-full h-full relative'>

      <Button
        className='absolute top-0 left-0 z-10 -translate-y-1/2'
        onClick={handleGenerateModel}
      >
        Generate Model
      </Button>

      <EditorDialogTrigger
        className='absolute top-0 right-0 z-10 -translate-y-1/2'
      />


      <ReactFlow
        snapToGrid
        fitView
        selectionOnDrag
        disableKeyboardA11y
        panOnDrag={[1, 2, 3, 4]}
        nodeOrigin={[0.5, 0.5]}
        minZoom={0.2}
        maxZoom={5}
        snapGrid={[10, 10]}
        translateExtent={[[-5000, -5000], [5000, 5000]]}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      >

        <Controls />
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
            onClick={() => handleAddNode(position)}
            className={cn(
              buttonVariants(),
              'p-0 h-8 w-8 flex items-center justify-center opacity-25 hover:opacity-100',
            )}
          >
            <PlusIcon className='w-4 h-4 flex-shrink-0' />
          </NodeToolbar>
        ))}

      </ReactFlow>
    </div>
  );
}

function Switch(props: NodeProps) {
  return (
    <div
      className={cn(
        'w-[140px] h-[140px] border-2 border-foreground rounded-md bg-secondary relative',
        props.selected && 'border-primary',
        props.data.overlaped && 'bg-destructive',
        props.data.overlaped && props.selected && 'border-destructive-foreground',
      )}
      style={{
        transform: `rotate(${props.data.rotation}deg)`,
        zIndex: 2
      }}
    >
    </div>
  );
}

function MCU(props: NodeProps) {
  return (
    <div
      className={cn(
        'w-[140px] h-[140px] border-2 border-foreground rounded-md bg-green-500 relative opacity-50',
        props.selected && 'border-primary',
        props.data.overlaped && 'bg-destructive',
        props.data.overlaped && props.selected && 'border-destructive-foreground',
      )}
      style={{
        transform: `rotate(${props.data.rotation}deg)`,
        width: `${props.data.width || 140}px`,
        height: `${props.data.height || 280}px`,
        zIndex: 1
      }}
    >
      <div className="bg-green-700 w-[90px] h-[30px] rounded-b absolute top-0 left-1/2 -translate-x-1/2" />
    </div>
  );
}
