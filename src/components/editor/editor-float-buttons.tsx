import { Box, CircuitBoard, Fullscreen, Info, Menu, Printer, Redo2, Scan, Share2, Sparkles, Trash, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import ThreeDModelGeneratorDialog from "./dialogs/3d-model-generator";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem, Divider } from "@nextui-org/react";
import ShareWebsiteDialog from "./dialogs/share-website-dialog";
import ResetEditorDialog from "./dialogs/reset-editor-dialog";
import WebsiteInfoDialog from "./dialogs/website-info-dialog";
import { cn } from "@/lib/utils";
import { EditorStoreType, useEditorStore } from "./stores/editor-store";
import { SelectionAcitonStore } from "./stores/selection-actions-store";
import SelectionActionFloatButtons from "./floatingButtons/selection-action";
import { useControls, useTransformContext } from "react-zoom-pan-pinch";


const selector = (state: EditorStoreType) => ({
  clearActiveNodes: state.clearActiveNodes,
  activeNodes: state.activeNodes,
});

export function EditorFloatButtons() {
  const [openModal, setOpenModal] = useState<0 | 1 | 2 | 3 | 4>(0)
  const { clearActiveNodes, activeNodes } = useEditorStore(selector)
  const selectionAction = SelectionAcitonStore()
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();

  const zoomCntrl = useControls()

  return (
    <>

      <ThreeDModelGeneratorDialog isOpen={openModal === 1} onOpenChange={(state) => setOpenModal(state ? 1 : 0)} />
      <ShareWebsiteDialog isOpen={openModal === 2} onOpenChange={(state) => setOpenModal(state ? 2 : 0)} />
      <ResetEditorDialog isOpen={openModal === 3} onOpenChange={(state) => setOpenModal(state ? 3 : 0)} />
      <WebsiteInfoDialog isOpen={openModal === 4} onOpenChange={(state) => setOpenModal(state ? 4 : 0)} />

      {/* model generation popup trigger */}
      <div className="absolute right-2 top-2">
        <Dropdown >
          <DropdownTrigger>
            <Button
              color="primary"
              isIconOnly
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" disabledKeys={["pcb", "2dSketch"]}>
            <DropdownItem
              key="3dModel"
              startContent={<Box className="mr-2" />}
              onPress={() => {
                setOpenModal(1)
              }}
            >
              Generate 3D model
            </DropdownItem>
            <DropdownItem
              key="2dSketch"
              startContent={<Printer className="mr-2" />}
            >
              Print 2D sketch
            </DropdownItem>
            <DropdownItem
              key="pcb"
              startContent={<CircuitBoard className="mr-2" />}
            >
              Generate pcb
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* App menu */}
      <div className="absolute top-2 left-2">
        <Popover placement="bottom-start" classNames={{ content: "p-2" }}>
          <PopoverTrigger>
            <Button
              isIconOnly
            >
              <Menu className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Listbox
              aria-label="Actions"
              onAction={(key) => {
                switch (key) {
                  case "share":
                    setOpenModal(2)
                    break;
                  case "reset":
                    setOpenModal(3)
                    break;
                  case "info":
                    setOpenModal(4)
                    break;
                  default:
                    break;
                }
              }}
              className="w-full"
            >
              <ListboxItem
                key="info"
                startContent={<Info />}
                description="for curious george"
              >
                Website Info
              </ListboxItem>
              <ListboxItem
                key="share"
                startContent={<Share2 />}
                description="sharing is caring"
              >
                Share Website
              </ListboxItem>
              <ListboxItem
                key="reset"
                className="text-danger"
                color="danger"
                startContent={<Trash />}
                description="work == POOF!"
              >
                Reset Editor
              </ListboxItem>
            </Listbox>
          </PopoverContent>
        </Popover>
      </div>

      {/* selection options buttons */}
      <div
        className={cn(
          "absolute top-1/2 left-2 bg-default p-1 rounded-xl z-20 -translate-y-1/2",
        )}
      >
        <SelectionActionFloatButtons />
      </div>

      <div
        className={cn(
          "absolute bottom-2 left-2 bg-default p-1 flex items-center justify-center rounded-xl z-20",
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


    </>
  )
}
