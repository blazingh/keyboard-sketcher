"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EditorContext } from "@/contexts/editor-context"
import { workSpaceContext } from "@/contexts/workspace-context"
import { calculateCenterPosition } from "@/lib/positions"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, PencilRuler, RotateCcw, RotateCw, MoveHorizontal, MoveVertical, RefreshCw } from "lucide-react"
import { useContext, useEffect, useMemo, useState } from "react"


export default function RightSidebar() {

  const editor = useContext(EditorContext)
  const workspace = useContext(workSpaceContext)

  const [heldButton, setHeldButton] = useState<string>("");

  const handleMouseDown = (btn: string) => {
    setHeldButton(btn);
  };

  const handleMouseUp = () => {
    setHeldButton("");
  };

  useEffect(() => {
    if (heldButton === "") return
    const id = setInterval(() => {
      editor?.moveSelectedNodes(heldButton as any)
    }, 100)
    return () => clearInterval(id)
  }, [heldButton, editor])

  const centerPos: { x: number, y: number } = function() {
    if (!editor?.nodes) return { x: 0, y: 0 }
    const positons: any = []
    editor.nodes.map((node) => {
      if (!editor.selectedNodes.includes(node.id)) return
      positons.push(node.position)
    })
    const center = calculateCenterPosition(positons)
    return center || { x: 0, y: 0 }
  }()

  const diffPos: { x: number, y: number } = function() {
    if (!editor) return { x: 0, y: 0 }
    return {
      x: Number((centerPos.x - editor.store.basePos.x).toFixed(1)),
      y: Number((centerPos.y - editor.store.basePos.y).toFixed(1)),
    }
  }()

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
          <div className="col-span-3 flex items-end w-full gap-2">
            <span className="w-full flex gap-1 line-clamp-1 whitespace-nowrap">
              {diffPos.x > 0 && <ArrowRight className="w-4" />}
              {diffPos.x < 0 && <ArrowLeft className="w-4" />}
              {diffPos.x === 0 && <MoveHorizontal className="w-4" />}
              {":"}{diffPos.x / 10}
            </span>
            <span className="w-full flex gap-1 line-clamp-1 whitespace-nowrap">
              {diffPos.y > 0 && <ArrowDown className="w-4" />}
              {diffPos.y < 0 && <ArrowUp className="w-4" />}
              {diffPos.y === 0 && <MoveVertical className="w-4" />}
              {":"}{diffPos.y / -10}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 *:w-12 *:h-12 *:flex-shrink-0 w-fit">
            <div />
            <Button
              onClick={() => editor.moveSelectedNodes("U")}
              onMouseDown={() => handleMouseDown("U")}
              onTouchStart={() => handleMouseDown("U")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            >
              <ArrowUp className="flex-shrink-0 w-5" />
            </Button>
            <div />
            <Button
              onClick={() => editor.moveSelectedNodes("L")}
              onMouseDown={() => handleMouseDown("L")}
              onTouchStart={() => handleMouseDown("L")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            >
              <ArrowLeft className="flex-shrink-0 w-5" />
            </Button>
            <Button
              onClick={() => editor.moveSelectedNodes("D")}
              onMouseDown={() => handleMouseDown("D")}
              onTouchStart={() => handleMouseDown("D")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            >
              <ArrowDown className="flex-shrink-0 w-5" />
            </Button>
            <Button
              onClick={() => editor.moveSelectedNodes("R")}
              onMouseDown={() => handleMouseDown("R")}
              onTouchStart={() => handleMouseDown("R")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchEnd={handleMouseUp}
              onTouchCancel={handleMouseUp}
            >
              <ArrowRight className="flex-shrink-0 w-5" />
            </Button>
          </div>
        </>}
      </div>
    </div>
  )
}

