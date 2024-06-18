import { Fullscreen, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { Button, Divider } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { EditorStoreType, useEditorStore } from "../stores/editor-store";
import { useControls } from "react-zoom-pan-pinch";
import GeneratorButtonGroup from "./generators";
import { PointerAcitonStore } from "../stores/pointer-actions-store";
import BaseActionOptions from "./base-actions-options";
import EditorMenu from "./editor-menu";


const selector = (state: EditorStoreType) => ({
  clearActiveNodes: state.clearActiveNodes,
});

export function ViewControls() {

  const { clearActiveNodes } = useEditorStore(selector)
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  const zoomCntrl = useControls()

  return (

    <div
      className={cn(
        "bg-default p-1 flex items-center justify-center rounded-xl z-20",
      )}
    >
      <Button
        variant={"light"}
        isIconOnly
        size='sm'
        onClick={() => {
          zoomCntrl.zoomToElement("nodes-outline")
        }}
      >
        <Fullscreen className='w-5 h-5' />
      </Button>

      <Divider orientation="vertical" className="h-6 mx-2" />

      <Button
        variant={"light"}
        isIconOnly
        size='sm'
        onClick={() => {
          zoomCntrl.zoomOut()
        }}
      >
        <ZoomOut className='w-5 h-5' />
      </Button>

      <Button
        variant={"light"}
        isIconOnly
        size='sm'
        onClick={() => {
          zoomCntrl.zoomIn()
        }}
      >
        <ZoomIn className='w-5 h-5' />
      </Button>

      <Divider orientation="vertical" className="h-6 mx-2" />

      <Button
        variant={"light"}
        isIconOnly
        size='sm'
        onClick={() => {
          clearActiveNodes()
          undo()
        }}
        isDisabled={!pastStates.length}
      >
        <Undo2 className='w-5 h-5' />
      </Button>

      <Button
        variant={"light"}
        isIconOnly
        size='sm'
        onClick={() => redo()}
        isDisabled={!futureStates.length}
      >
        <Redo2 className='w-5 h-5' />
      </Button>
    </div>

  )
}
