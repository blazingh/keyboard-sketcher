import { Box, CircuitBoard, Printer, Sparkles } from "lucide-react";
import ThreeDModelGeneratorDialog from "./dialogs/3d-model-generator";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export function EditorFloatButtons() {
  const [open, setOpen] = useState(false)
  return (
    <>

      <ThreeDModelGeneratorDialog isOpen={open} onOpenChange={(state) => setOpen(state)} />

      {/* model generation popup trigger */}
      <div className="absolute bottom-2 right-2">
        <Dropdown        >
          <DropdownTrigger>
            <Button
              size="lg"
              color="primary"
              isIconOnly
            >
              <Sparkles className='shrink-0' />
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

    </>
  )
}
