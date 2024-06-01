import { Button, Modal, ModalContent, ModalProps } from "@nextui-org/react"
import ThreeDModelGenerator from "../genarators/3d-model-generator"
import { X } from "lucide-react"


export default function ThreeDModelGeneratorDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: ModalProps["onOpenChange"] }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      size="5xl"
      classNames={{
        base: "max-w-[90svw] max-h-[90svh]"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ThreeDModelGenerator />
            <Button
              isIconOnly
              onPress={onClose}
              size={"sm"}
              className="absolute top-2 right-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
