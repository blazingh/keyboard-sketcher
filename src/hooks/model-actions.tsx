import ToastFinishModel from "@/components/editor/toasts/finished-model"
import ToastPendingModel from "@/components/editor/toasts/pending-model"
import { Canvas } from '@react-three/fiber'
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { signal } from "@preact/signals-react"
import { useCallback, useState } from "react"
import { StlViewer } from "react-stl-viewer"
import { CameraControls, OrbitControls } from "@react-three/drei"
import { Node } from "reactflow"
import { toast } from "sonner"
import { BackSide, DirectionalLight, Material, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, PCFSoftShadowMap, PointLight } from "three"
import { CSG2Geom } from "@/lib/geometries"
import { ModelWorkerResult } from "@/workers/model-generator"

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

export function useModelActions() {

  const [openModelData, setOpenModelData] = useState<WorkerSignal | null>(null)

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

    newWorker.postMessage({ nodes: nodes, id: id })

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

    [worker.plateStlData, worker.caseStlData].map((item, index) => {
      const modelUrl = URL.createObjectURL(new Blob(item))
      const a = document.createElement("a")
      a.href = modelUrl
      a.download = index === 1 ? "plate.stl" : "case.stl"
      a.click()
      a.remove()
    })

  }

  const ModelPreviewJsx = useCallback(() => {

    if (!openModelData) return

    const light = new DirectionalLight('white', 1);
    light.position.set(0, 0, 0);


    const mat = new MeshStandardMaterial({ side: BackSide })

    console.log(openModelData)

    return (
      <Dialog open={true}  >
        <DialogContent className='max-w-4xl' onInteractOutside={(e) => e?.preventDefault} >
          <div className='w-full h-[70svh] flex flex-col gap-4'>
            <Canvas
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

              {openModelData.geoms.map((csg: ModelWorkerResult["geometries"][number], index: number) => {
                const geos = CSG2Geom(csg.geom)
                return (
                  <mesh geometry={geos} position={[0, 0, 0]} material={mat} scale={0.1} />
                )
              })}

            </Canvas>
            <Button
              variant="destructive"
              onClick={() => {
                deleteModel(openModelData.id)
                setOpenModelData(null)
              }}
            >
              delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }, [openModelData])
  /*
  const ModelPreviewJsx = useCallback(() => {
    if (!openModelData) return
    const modelUrl = URL.createObjectURL(new Blob(openModelData.previewStlData))
    return (
      <Dialog open={true}  >
        <DialogContent className='max-w-4xl' onInteractOutside={(e) => e?.preventDefault} >
          <div className='w-full h-[70svh] flex flex-col gap-4'>
            <StlViewer
              orbitControls
              shadows
              className='w-full h-full'
              modelProps={{ color: "indianred" }}
              url={modelUrl}
            />
            <div className='flex w-full items-center justify-between'>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteModel(openModelData.id)
                  setOpenModelData(null)
                }}
              >
                delete
              </Button>
              <Button
                onClick={() => {
                  downloadModels(openModelData.id)
                  setOpenModelData(null)
                  toast.success("Downoloaded Models ;)")
                }}
              >
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }, [openModelData])
  */

  return {
    generateModel,
    cancelModelGeneration,
    viewModel,
    deleteModel,
    ModelPreviewJsx
  };
}
