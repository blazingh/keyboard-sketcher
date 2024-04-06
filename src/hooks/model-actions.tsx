import ToastFinishModel from "@/components/sketcher/toasts/finished-model"
import ToastPendingModel from "@/components/sketcher/toasts/pending-model"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { signal } from "@preact/signals-react"
import { useState } from "react"
import { StlViewer } from "react-stl-viewer"
import { Node } from "reactflow"
import { toast } from "sonner"

type WorkerSignal = {
  worker: Worker,
  startTime: Date,
  resolver: any,
  rejecter: any,
  toastId?: any,
  previewStlData?: any
  caseStlData?: any
  plateStlData?: any
}

type WorkersSignal = {
  [key: number]: WorkerSignal
}

export const workersSigals = signal<WorkersSignal>({});

export function useModelActions() {

  const [openModelPreviewId, setOpenModelPreviewId] = useState(0)

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
    setOpenModelPreviewId(id)
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
      setTimeout(() => {
        clearWorker(id)
      }, 1000 * 60 * 2)
    };

    newWorker.postMessage({ nodes: nodes, id: id })

    const toastId = toast.promise(
      new Promise((resolve, reject) =>
        workersSigals.value[id] = {
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

  function ModelPreviewJsx() {
    if (typeof window === "undefined" || !workersSigals.value[openModelPreviewId]) return
    const modelUrl = URL.createObjectURL(new Blob(workersSigals.value[openModelPreviewId].previewStlData))
    return (
      <Dialog open={openModelPreviewId !== 0}  >
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
                  deleteModel(openModelPreviewId)
                  setOpenModelPreviewId(0)
                }}
              >
                delete
              </Button>
              <Button
                onClick={() => {
                  downloadModels(openModelPreviewId)
                  setOpenModelPreviewId(0)
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
  }

  return {
    generateModel,
    cancelModelGeneration,
    viewModel,
    deleteModel,
    ModelPreviewJsx
  };
}