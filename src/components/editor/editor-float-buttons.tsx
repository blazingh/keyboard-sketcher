import { Box, CircuitBoard, Printer, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import ThreeDModelGeneratorDialog from "./dialogs/3d-model-generator";
import { useState } from "react";

export function EditorFloatButtons() {
  const [open, setOpen] = useState(false)
  return (
    <>

      <ThreeDModelGeneratorDialog open={open} onOpenChange={(state) => setOpen(state)} />

      {/* model generation popup trigger */}
      <div className='absolute bottom-5 right-5'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='w-12 h-12'>
              <Sparkles className='shrink-0' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mb-5">

            <DropdownMenuItem onSelect={() => setOpen(true)}  >
              <Box className="mr-2" />
              Generate 3D model
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              <CircuitBoard className="mr-2" />
              Generate pcb
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              <Printer className="mr-2" />
              Print sketch
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </>
  )
}
