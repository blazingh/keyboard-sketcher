import { Box, CircuitBoard, Printer, Sparkles } from "lucide-react";
import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { track } from "@vercel/analytics/react";
import ThreeDModelGeneratorDialog from "../dialogs/3d-model-generator";
import PCBGeneratorDialog from "../dialogs/pcb-generator";

export default function GeneratorButtonGroup() {
  const [openModal, setOpenModal] = useState<0 | 1 | 2>(0)

  return (
    <>

      <ThreeDModelGeneratorDialog isOpen={openModal === 1} onOpenChange={(state) => setOpenModal(state ? 1 : 0)} />
      <PCBGeneratorDialog isOpen={openModal === 2} onOpenChange={(state) => setOpenModal(state ? 2 : 0)} />

      <Dropdown >
        <DropdownTrigger>
          <Button
            color="primary"
            isIconOnly
          >
            <Sparkles className="w-5 h-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" disabledKeys={["2dSketch"]}>
          <DropdownItem
            key="3dModel"
            startContent={<Box className="mr-2" />}
            onPress={() => {
              track("3D_Model_Generated")
              setOpenModal(1)
            }}
          >
            Generate 3D model
          </DropdownItem>
          <DropdownItem
            key="pcb"
            startContent={<CircuitBoard className="mr-2" />}
            onPress={() => {
              track("PCB_Generated")
              setOpenModal(2)
            }}
          >
            Generate pcb
          </DropdownItem>
          <DropdownItem
            key="2dSketch"
            startContent={<Printer className="mr-2" />}
          >
            Print 2D sketch
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}
