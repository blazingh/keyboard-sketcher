"use client"
import { Button } from "@/components/ui/button"
import { EditorContext } from "@/contexts/editor-context"
import { workSpaceContext } from "@/contexts/workspace-context"
import { calculateCenterPosition } from "@/lib/positions"
import { cn } from "@/lib/utils"
import { PencilRuler } from "lucide-react"
import { useContext, useMemo, useState } from "react"


export default function RightSidebar() {

  const editor = useContext(EditorContext)
  const workspace = useContext(workSpaceContext)

  const centerPos: { x: number, y: number } = useMemo(() => {
    if (!editor?.nodes) return { x: 0, y: 0 }
    const positons: any = []
    editor.nodes.map((node) => {
      if (!editor.selectedNodes.includes(node.id)) return
      positons.push(node.position)
    })
    const center = calculateCenterPosition(positons)
    return center || { x: 0, y: 0 }
  }, [editor?.nodes])

  const open = workspace?.options.openBar === "right"

  return (
    <div className={cn(
      "fixed h-svh z-30 top-0 right-0 transition-all  ease-in-out w-[280px]",
      open ? "shadow-xl" : "translate-x-[278px] shadow-none"
    )}
    >
      {/* side bar toggle button */}
      <Button
        onClick={() => workspace?.updateOption('openBar', open ? "" : "right")}
        className={cn(
          'absolute top-4 left-0 transition-all ease-in-out py-6 z-20 -translate-x-full rounded-r-none',
          'flex items-center justify-center',
          open ? "px-2 pr-1" : "px-3 pr-2",
        )}
      >
        <PencilRuler className='w-5 h-5' />
      </Button>

      {/* tabs content */}
      <div
        className={cn(
          "w-full h-full overflow-hidden flex flex-col p-4 gap-4 relative border-l-2 border-primary bg-background",
          open && "rounded-l-2xl"
        )}
      >
        {(!editor?.selectedNodes || editor.selectedNodes.length < 1) && <div>no selected nodes</div>}
        {(editor?.selectedNodes && editor.selectedNodes.length > 0) && <>
          {JSON.stringify(centerPos)}
        </>}
      </div>


    </div>
  )
}

