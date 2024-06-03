import { Box, CircuitBoard, Info, Menu, Printer, Settings2, Share, Share2, Sparkles, Trash } from "lucide-react";
import ThreeDModelGeneratorDialog from "./dialogs/3d-model-generator";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Popover, PopoverTrigger, PopoverContent, Listbox, ListboxItem } from "@nextui-org/react";

export function EditorFloatButtons() {
  const [open, setOpen] = useState(false)
  return (
    <>

      <ThreeDModelGeneratorDialog isOpen={open} onOpenChange={(state) => setOpen(state)} />

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
                setOpen(true)
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
              onAction={(key) => alert(key)}
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
                key="info"
                startContent={<Share2 />}
                description="sahring is caring"
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

      {/* selected tool options */}
      <div className="absolute bottom-2 left-2">
        <Popover placement="top-start">
          <PopoverTrigger>
            <Button
              isIconOnly
            >
              <Settings2 className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            any
          </PopoverContent>
        </Popover>
      </div>

    </>
  )
}
