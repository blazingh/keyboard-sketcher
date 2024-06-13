"use Client"
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@nextui-org/react"
import { X } from "lucide-react"
import { EditorStoreType, useEditorStore } from "../stores/editor-store";
import { useControls } from "react-zoom-pan-pinch";


const editorStoreSelector = (state: EditorStoreType) => ({
  resetState: state.resetState
})

export default function ResetEditorDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: ModalProps["onOpenChange"] }) {

  const editor = useEditorStore(editorStoreSelector)
  const zoomControll = useControls()

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      classNames={{
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              Reset Editor
              <Button
                isIconOnly
                onPress={onClose}
                size={"sm"}
                className="absolute top-2 right-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </ModalHeader>

            <ModalBody >

              <div className="mb-2 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <p>
                    all your changes will be gone. you will not be able to undo this action.
                  </p>
                  <p>
                    are you sure you want to reset the editor ?
                  </p>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <Button
                    onPress={onClose}
                  >
                    I changed my mind
                  </Button>
                  <Button
                    color="danger"
                    onPress={() => {
                      editor.resetState()
                      zoomControll.zoomToElement("nodes-outline")
                      onClose()
                    }}
                  >
                    Reset it please
                  </Button>
                </div>
              </div>

            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
