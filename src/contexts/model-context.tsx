"use client"
import ToastFinishModel from "@/components/old_editor/toasts/finished-model"
import ToastPendingModel from "@/components/old_editor/toasts/pending-model"
import { Canvas } from '@react-three/fiber'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { signal } from "@preact/signals-react"
import { createContext, useState } from "react"
import { OrbitControls } from "@react-three/drei"
import { Node } from "reactflow"
import { toast } from "sonner"
import { BackSide, DirectionalLight, MeshStandardMaterial, PCFSoftShadowMap } from "three"
import { CSG2Geom } from "@/lib/geometries"
import { ModelAOptionsTypes, ModelWorkerResult, modelADefaultOptionsValues } from "@/workers/model-a-options"
import { Switch } from "@/components/ui/switch"
/* @ts-ignore */
import stlSerializer from '@jscad/stl-serializer'

type ModelOpitons = { type: "a", options: ModelAOptionsTypes }

type ModelContext = {
  selectedOptions: any,//ModelOpitons,
  updateOptionValue: (type: any, key?: string, value?: any) => void,
  generateModel: (nodes: Node[]) => void,
  cancelModelGeneration: (id: number) => void,
  viewModel: (id: number) => void,
  deleteModel: (id: number) => void,
}

export const ModelContext = createContext<ModelContext | null>(null);

type WorkerSignal = {
  id: number,
  worker: Worker,
  startTime: Date,
  resolver: any,
  rejecter: any,
  toastId?: any,
  geoms?: any,
  previewStlData?: any
  caseStlData?: any
  plateStlData?: any
}

type WorkersSignal = {
  [key: number]: WorkerSignal
}

export const workersSigals = signal<WorkersSignal>({});

export function ModelContextProvider({ children }: any) {

  const [openModelData, setOpenModelData] = useState<WorkerSignal | null>(null)

  const [selectedOptions, setSelectedOptions] = useState<ModelOpitons>({
    type: "a",
    options: modelADefaultOptionsValues
  })

  function updateOptionValue(type: any, key?: string, value?: any) {
    /*
    if (!key) {
      setSelectedOptions({ type, options: {} })
      return
    }
    setSelectedOptions(p => {
      const options = type === p.type ? { ...p.options, [key]: value } : { [key]: value }
      return { type, options }
    })
    */
  }

  function clearWorker(id: number) {
    if (!workersSigals.value[id]) return
    delete workersSigals.value[id]
  }

  function deleteModel(id: number) {
  }

  function cancelModelGeneration(id: number) {
    const worker = workersSigals.value[id]

    if (typeof window === 'undefined' || !window.Worker || !worker) return
    if (worker.toastId) toast.dismiss(worker.toastId)

    workersSigals.value[id].worker.terminate()
    workersSigals.value[id].rejecter()
    toast.warning("Model Generation Cancelled")

    clearWorker(id)
  }

  function viewModel(id: number) {
    const worker = workersSigals.value[id]
    if (!worker) return
    if (worker.toastId) toast.dismiss(worker.toastId)
    setOpenModelData(worker)
  }

  function generateModel(nodes: Node[]) {
    if (typeof window === 'undefined' || !window.Worker) return
    const id = Math.random()

    const newWorker = new Worker(new URL("../workers/model-generator.ts", import.meta.url))

    newWorker.onmessage = (e: MessageEvent<any>) => {
      workersSigals.value[e.data.id].resolver({
        totalTime: Date.now() - workersSigals.value[e.data.id].startTime.getTime()
      })
      workersSigals.value[e.data.id].previewStlData = e.data.previewStlData
      workersSigals.value[e.data.id].caseStlData = e.data.caseStlData
      workersSigals.value[e.data.id].plateStlData = e.data.plateStlData
      workersSigals.value[e.data.id].geoms = e.data.geoms
      setTimeout(() => {
        clearWorker(id)
      }, 1000 * 60 * 2)
    };

    newWorker.postMessage({ nodes: nodes, id: id, options: selectedOptions.options })

    const toastId = toast.promise(
      new Promise((resolve, reject) =>
        workersSigals.value[id] = {
          id: id,
          worker: newWorker,
          startTime: new Date(),
          resolver: resolve,
          rejecter: reject,
        }
      ),
      {
        duration: 1000 * 60 * 2,
        onDismiss: () => clearWorker(id),
        loading: ToastPendingModel({ onActionClick: () => cancelModelGeneration(id) }),
        success: (data: any) =>
          <ToastFinishModel
            totalTime={data.totalTime}
            onActionClick={() => viewModel(id)}
          />,
      }
    )
    workersSigals.value[id].toastId = toastId
  }

  function downloadModels(id: number) {
    const worker = workersSigals.value[id]
    if (!worker || typeof window === "undefined") return

    worker.geoms.map((csg: ModelWorkerResult["geometries"][number]) => {
      const stlData = stlSerializer.serialize({ binary: true }, csg.geom)
      const modelUrl = URL.createObjectURL(new Blob(stlData))
      const a = document.createElement("a")
      a.href = modelUrl
      a.download = `${csg.label}.stl`
      a.click()
      a.remove()
    })

  }

  const ModelPreviewJsx = () => {

    const [hiddenGeoms, setHiddenGeoms] = useState<number[]>([])

    if (!openModelData) return

    const light = new DirectionalLight('white', 1);
    light.position.set(0, 0, 0);

    const mat = new MeshStandardMaterial({ side: BackSide })

    return (
      <Dialog open={true}  >
        <DialogContent className='max-w-4xl p-0 overflow-hidden' onInteractOutside={(e) => e?.preventDefault} >
          <div className='w-full h-[70svh] flex flex-col gap-4 relative '>
            <Canvas
              className="w-full h-full"
              shadows
              gl={{
                preserveDrawingBuffer: true,
                shadowMapType: PCFSoftShadowMap,
                antialias: true
              }}
              onCreated={({ camera, scene }) => {
                camera.add(light);
                scene.add(camera);
              }}>
              <OrbitControls />
              <ambientLight intensity={0.3} color={'white'} />

              {openModelData.geoms.map((csg: ModelWorkerResult["geometries"][number]) => !hiddenGeoms.includes(csg.id) && (
                <mesh key={csg.id} geometry={CSG2Geom(csg.geom)} position={[0, 0, 0]} material={mat} scale={0.1} />
              ))}

            </Canvas>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {openModelData.geoms.map((csg: ModelWorkerResult["geometries"][number]) => (
                <div key={csg.id} className="flex gap-2">
                  <Switch
                    checked={!hiddenGeoms.includes(csg.id)}
                    onCheckedChange={(v) =>
                      setHiddenGeoms(p =>
                        p.includes(csg.id)
                          ? p.filter(el => el !== csg.id)
                          : [...p, csg.id]
                      )}
                  />
                  <label>{csg.label}</label>
                </div>
              ))}
            </div>
            <Button
              className="absolute bottom-4 left-4 w-1/3"
              variant="destructive"
              onClick={() => {
                deleteModel(openModelData.id)
                setOpenModelData(null)
              }}
            >
              delete
            </Button>
            <Button
              className="absolute bottom-4 right-4 w-1/3"
              onClick={() => {
                downloadModels(openModelData.id)
                setOpenModelData(null)
                toast.success("Downoloaded Models ;)")
              }}
            >
              delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <ModelContext.Provider value={{
      selectedOptions,
      updateOptionValue,
      generateModel,
      cancelModelGeneration,
      viewModel,
      deleteModel,
    }}>
      <ModelPreviewJsx />
      {children}
    </ModelContext.Provider>
  )
}
