"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, PencilRuler } from "lucide-react"
import { useContext, useEffect, useMemo, useState } from "react"
import { useModelActions } from "@/hooks/model-actions"
import { useNodes } from "reactflow"
import { EditorContext } from "@/contexts/editor-context"
import { calculateCenterPosition } from "@/lib/positions"


export default function RightSidebar() {

  const [open, setOpen] = useState(false)

  const editor = useContext(EditorContext)

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

  return (
    <div className={cn(
      "fixed h-svh z-30 top-0 right-0 transition-all  ease-in-out w-[280px]",
      open ? "shadow-xl" : "translate-x-[279px] shadow-none"
    )}
    >
      {/* side bar toggle button */}
      <Button
        onClick={() => setOpen(p => !p)}
        className={cn(
          'absolute top-4 left-0 transition-all ease-in-out py-6 z-20 -translate-x-full rounded-r-none',
          'flex items-center justify-center',
          open ? "px-2 pr-1" : "px-3 pr-2",
          !open && editor?.selectedNodes && editor.selectedNodes.length < 1 && 'hidden'
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

