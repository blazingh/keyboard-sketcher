"use client"
import { Button } from "@/components/ui/button"
import { EditorContext } from "@/contexts/editor-context"
import { workSpaceContext } from "@/contexts/workspace-context"
import { calculateCenterPosition } from "@/lib/positions"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, PencilRuler } from "lucide-react"
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
      "fixed bottom-0 left-0 transition-all ease-in-out w-svw md:w-[282px] h-[282px] md:h-svh z-20",
      "translate-y-[calc(100%-280px)] md:translate-y-0 md:-translate-x-[2px]",
      open && "z-30",
      !open && "md:-translate-x-[280px]",
      !open && "translate-y-[calc(100%-2px)]"
    )}
    >
      {/* side bar toggle button */}
      <Button
        variant={open ? "default" : "secondary"}
        onClick={() => workspace?.updateOption('openBar', open ? "" : "right")}
        className={cn(
          'absolute transition-all ease-in-out py-6 z-20 rounded-b-none md:rounded-l-none md:rounded-r-md',
          "top-0 md:top-20 left-20 md:right-0 md:left-[unset] -translate-y-full md:translate-y-0 md:translate-x-full",
          'flex items-center justify-center p-3 md:px-2 border border-primary',
          !open && workspace?.options.openBar !== "" && "-translate-y-[calc(100%+278px)] md:translate-x-[calc(100%+278px)] md:translate-y-0"
        )}
      >
        <PencilRuler className='w-5 h-5 md:w-6 md:h-6' />
      </Button>

      {/* tabs content */}
      <div
        className={cn(
          "w-full h-full overflow-hidden flex flex-col p-4 gap-4 relative border-2 border-primary bg-background",
          open && "rounded-t-2xl md:rounded-r-2xl md:rounded-l-none"
        )}
      >
        {(!editor?.selectedNodes || editor.selectedNodes.length < 1) && (
          <div className="w-full h-full flex items-center justify-center">no selected nodes
          </div>
        )}
        {(editor?.selectedNodes && editor.selectedNodes.length > 0) && <>
          {JSON.stringify(centerPos)}
          <div className="flex gap-2">
            <Button
              onClick={() => editor.moveSelectedNodes("L")}
            >
              <ArrowLeft />
            </Button>
            <Button
              onClick={() => editor.moveSelectedNodes("D")}
            >
              <ArrowDown />
            </Button>
            <Button
              onClick={() => editor.moveSelectedNodes("U")}
            >
              <ArrowUp />
            </Button>
            <Button
              onClick={() => editor.moveSelectedNodes("R")}
            >
              <ArrowRight />
            </Button>
          </div>
        </>}
      </div>


    </div>
  )
}

