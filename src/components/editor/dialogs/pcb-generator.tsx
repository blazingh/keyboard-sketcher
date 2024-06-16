import { Button, Modal, ModalContent, ModalProps } from "@nextui-org/react"
import { X } from "lucide-react"
import PCBGenerator from "../genarators/pcb-generator"


export default function PCBGeneratorDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: ModalProps["onOpenChange"] }) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      classNames={{
        base: ""
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <PCBGenerator />
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
