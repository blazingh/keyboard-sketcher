"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { signal } from "@preact/signals-react";
import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  NodeChange,
  NodeToolbar,
  Position,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import { Key } from 'ts-key-enum';
import EditorDialogTrigger from './modals/editor-info';
import { Button, buttonVariants } from './ui/button';
import MCU from "./sketcher/nodes/mcu";
import Switch from "./sketcher/nodes/switch";
import { initialNodes } from "@/constants/temp";
import ToastFinishModel from "./sketcher/toasts/finished-model";
import ToastPendingModel from "./sketcher/toasts/pending-model";
import ModelPreview from "./sketcher/modals/model-preview";

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

export function SketcherWorkSpace() {

  const nodeTypes = useMemo(() => ({ switch: Switch, mcu: MCU }), []);
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [modelsGeo, setModelsGeo] = useState<any>()

  const [previewData, setPreviewData] = useState({
    case_geo: null,
    plate_geo: null,
    open: false
  })

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
    const isMcu = nodes.find((node) => node.selected && node.type === 'mcu')
    if (isMcu) deltas = [deltas[0] * 0.5, deltas[1] * 0.5]
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

  function handleCancelGeneration(id: number, toastId?: any) {
    if (toastId) toast.dismiss(toastId)
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
    workersSigals.value[id].status = 'rejected'
    workersSigals.value[id].rejecter()
    toast("Model Generation Cancelled")
  }

  function handleViewModel(id: number, toastId?: any) {
    setPreviewData({ ...previewData, open: true })
    return
    /*
    if (toastId) toast.dismiss(toastId)
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const a = document.getElementById(`pending-modal-${id}`)
    if (!a) return
    a.click()
    a.remove()
    toast.dismiss()
    */
  }

  function handleDeleteModel(id: number) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const a = document.getElementById(`pending-modal-${id}`)
    if (!a) return
    a.remove()
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
      setModelsGeo(e.data.rawData)
      setTimeout(() => {
        handleDeleteModel(id)
      }, 1000 * 60 * 2)
    };
    newWorker.postMessage(JSON.stringify({ nodes: nodes, id: id }))
    let toastId: any
    toastId = toast.promise(
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
        duration: 1000 * 60 * 2,
        onDismiss: () => handleDeleteModel(id),
        loading: ToastPendingModel({ onActionClick: () => handleViewModel(id, toastId) }),
        success: (data: any) =>
          <ToastFinishModel
            totalTime={data.totalTime}
            onActionClick={() => handleViewModel(id, toastId)}
          />,
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

      <Dialog open={previewData.open} onOpenChange={(state) => setPreviewData({ ...previewData, open: state })} >
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className='h-[60svh] max-w-2xl'>
          <ModelPreview fiberGeometries={modelsGeo} />
        </DialogContent>
      </Dialog>

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
