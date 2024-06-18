import { Info, Menu, Share2, Trash } from "lucide-react";
import { useState } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem } from "@nextui-org/react";
import ShareWebsiteDialog from "../dialogs/share-website-dialog";
import ResetEditorDialog from "../dialogs/reset-editor-dialog";
import WebsiteInfoDialog from "../dialogs/website-info-dialog";


export default function EditorMenu() {
  const [openModal, setOpenModal] = useState<0 | 1 | 2 | 3 | 4>(0)

  return (
    <>

      <ShareWebsiteDialog isOpen={openModal === 2} onOpenChange={(state) => setOpenModal(state ? 2 : 0)} />
      <ResetEditorDialog isOpen={openModal === 3} onOpenChange={(state) => setOpenModal(state ? 3 : 0)} />
      <WebsiteInfoDialog isOpen={openModal === 4} onOpenChange={(state) => setOpenModal(state ? 4 : 0)} />

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
    </>
  )
}
