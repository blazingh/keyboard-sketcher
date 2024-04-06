"use client"
import { cn } from "@/lib/utils"
import { ReactFlowProvider } from "reactflow"
import { Button } from "@/components/ui/button"
import { PencilRuler } from "lucide-react"
import { useState } from "react"
import { SketcherWorkSpace } from "./sketcher-workspace"
import LeftSidebar from "./sidebars/leftSideBar"
import AddNodeButton from "./add-node-button"

export default function MainWorkSpace() {

  const [editOpen, setEditOpen] = useState(false)
  return (
    <ReactFlowProvider>
      <SketcherWorkSpace />
      <div className="absolute top-5 left-5 z-10">
        <AddNodeButton />
      </div>
      <LeftSidebar />
      <div className={cn(
        "fixed h-svh z-30 top-0 right-0 bg-background rounded-l-2xl transition-all border-l-2 border-primary ease-in-out",
        editOpen ? "w-[280px] shadow-xl" : "w-0 shadow-none"
      )}
      >
        <Button
          onClick={() => setEditOpen(p => !p)}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 left-0 transition-all ease-in-out py-6',
            editOpen ? "-translate-x-1/2 px-1.5" : "-translate-x-full rounded-r-none"
          )}
        >
          <PencilRuler className='w-5 h-5' />
        </Button>
      </div>
    </ReactFlowProvider >
  )
}
