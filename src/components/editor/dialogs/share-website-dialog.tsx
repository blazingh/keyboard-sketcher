"use Client"
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalProps } from "@nextui-org/react"
import { Check, Copy, X } from "lucide-react"
import { RedditIcon, RedditShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from "react-share"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";

const link = "https://sketcher.hadibaalbaki.com"
const title = "come and check out this thing"

export default function ShareWebsiteDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: ModalProps["onOpenChange"] }) {

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCopied(false)
  }, [isOpen])

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
              Tell a friend
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

              <div className="flex gap-4 mb-4">
                <Input
                  defaultValue={link}
                  readOnly
                />
                <CopyToClipboard
                  text={link}
                >
                  <Button
                    color={copied ? "success" : "default"}
                    onPress={() => setCopied(true)}
                    isIconOnly
                  >
                    {copied
                      ? <Check />
                      : <Copy />
                    }
                  </Button>
                </CopyToClipboard>
              </div>

              <div className="flex items-center gap-4 justify-center w-full mb-2">

                <RedditShareButton
                  url={`${link}`}
                  title={`${title} ${link}`}
                  windowWidth={660}
                  windowHeight={460}
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>

                <TwitterShareButton
                  url={link}
                  title={title}
                >
                  <XIcon size={32} round />
                </TwitterShareButton>

                <WhatsappShareButton
                  url={link}
                  title={title}
                  separator=":: "
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>

              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
