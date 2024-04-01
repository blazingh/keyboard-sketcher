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
  stlUrl?: string
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
    // setPreviewData({ workerId: id, open: true })
    /*
    if (toastId) toast.dismiss(toastId)
    if (typeof window === 'undefined' || typeof document === 'undefined' || !workersSigals.value[id]) return
    if (!workersSigals.value[id].stlUrl || typeof workersSigals.value[id].stlUrl !== "string") {
      toast.error("Model no longer availble")
      return
    }
    const a = document.createElement("a")
    a.href = workersSigals.value[id].stlUrl || ""
    a.click()
    a.remove()
        handleClearWorker(id)
    */
  }

  function generateModel(nodes: Node[]) {
    if (typeof window === 'undefined' || !window.Worker) return
    const id = Math.random()

    const newWorker = new Worker(new URL("../workers/model-generator.ts", import.meta.url))

    newWorker.onmessage = (e: MessageEvent<any>) => {
      workersSigals.value[e.data.id].resolver({
        totalTime: Date.now() - workersSigals.value[e.data.id].startTime.getTime()
      })
      const newUrl = URL.createObjectURL(new Blob(e.data.rawData))
      workersSigals.value[e.data.id].stlUrl = newUrl
      setTimeout(() => {
        clearWorker(id)
      }, 1000 * 60 * 2)
    };

    newWorker.postMessage(JSON.stringify({ nodes: nodes, id: id }))

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

  function ModelPreviewJsx() {
    return (
      <Dialog open={openModelPreviewId !== 0}  >
        <DialogContent className='max-w-4xl' onInteractOutside={(e) => e?.preventDefault} >
          <div className='w-full h-[70svh] flex flex-col gap-4'>
            <StlViewer
              orbitControls
              shadows
              className='w-full h-full'
              modelProps={{ color: "indianred" }}
              url={workersSigals.value[openModelPreviewId]?.stlUrl || ""}
            />
            <div className='flex w-full items-center justify-between'>
              <Button
                onClick={() => {
                  deleteModel(openModelPreviewId)
                  setOpenModelPreviewId(0)
                }}
              >
                delete
              </Button>
              <Button>
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
