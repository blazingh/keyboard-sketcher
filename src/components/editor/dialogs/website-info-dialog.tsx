"use Client"
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@nextui-org/react"
import { X } from "lucide-react"


export default function WebsiteInfoDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: ModalProps["onOpenChange"] }) {

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
              Website Info
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

              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
