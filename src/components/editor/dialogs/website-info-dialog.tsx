"use Client"
import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@nextui-org/react"
import { Github, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


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
              <div className="mb-2 flex flex-col gap-4 items-center">
                <div className="flex flex-col items-center">
                  <p>I am too lazy to write anything</p>
                  <p>Here is my email if you want anything</p>
                  <a href="mailto:hey@hadibaalbaki.com" target="_blank" className="text-primary underline">hey@hadibaalbaki.com</a>
                </div>
                <Divider />
                <div className="flex flex-col items-center">
                  <p >⭐ Star ⭐ the project on Github </p>
                  <p>or steel the code if you care enough</p>
                  <Link href={"https://ko-fi.com/O5O4TP3U4"} target="_blank" className="bg-white rounded-xl p-2 mt-2">
                    <Github className="text-secondary" />
                  </Link>
                </div>
                <Divider />
                <div className="flex flex-col items-center gap-2">
                  <p className="text-center">This link is only if you managed to capture an elf or grow a money tree</p>
                  <Link href={"https://ko-fi.com/O5O4TP3U4"} target="_blank">
                    <Image
                      src={"https://storage.ko-fi.com/cdn/kofi2.png?v=3"}
                      width={150}
                      height={50}
                      alt="Buy me a Coffee at ko-fi.com"
                    />
                  </Link>
                </div>
              </div>
            </ModalBody>

          </>
        )}
      </ModalContent>
    </Modal>
  )
}
