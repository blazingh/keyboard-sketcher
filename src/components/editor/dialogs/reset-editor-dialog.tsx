"use Client"
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@nextui-org/react"
import { X } from "lucide-react"
import { EditorStoreType, useEditorStore } from "../stores/editor-store";
import { ViewportTransformationStoreType, useViewportTransformationStore } from "../stores/viewport-transformation-store";


const editorStoreSelector = (state: EditorStoreType) => ({
  resetState: state.resetState
})
const viewportStoreSelector = (state: ViewportTransformationStoreType) => ({
  resetState: state.resetState
})

export default function ResetEditorDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: ModalProps["onOpenChange"] }) {

  const editor = useEditorStore(editorStoreSelector)
  const viewport = useViewportTransformationStore(viewportStoreSelector)

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
                    all your changes will be gone. you woun&#39t be able to undo this action.
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
                      viewport.resetState()
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
