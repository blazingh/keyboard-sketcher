"use client"
import Draggable from 'react-draggable';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EditorContext } from "@/contexts/editor-context"
import { workSpaceContext } from "@/contexts/workspace-context"
import { calculateCenterPosition } from "@/lib/positions"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, PencilRuler, RotateCcw, RotateCw, MoveHorizontal, MoveVertical, RefreshCw, Hand, GripHorizontal } from "lucide-react"
import { useContext, useEffect, useMemo, useState } from "react"


export default function NodesControll() {

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

  const visible = editor && editor.selectedNodes.length > 0

  if (!editor) return null

  return (
    <Draggable
      handle='.handle'
    >
      <div
        className={cn(
          "absolute bottom-5 right-5 z-10 w-[160px] h-[160px]",
          "bg-background p-4 rounded-lg border",
          "flex flex-col gap-2",
          !visible && "hidden"
        )}
      >
        <div className='handle absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary rounded px-1 opacity-50 hover:opacity-100'>
          <GripHorizontal className='w-4 h-4' />
        </div>
        <div className="col-span-3 flex items-end justify-between w-full gap-2">
          <span className="flex gap-1 line-clamp-1 whitespace-nowrap">
            {diffPos.x > 0 && <ArrowRight className="w-4" />}
            {diffPos.x < 0 && <ArrowLeft className="w-4" />}
            {diffPos.x === 0 && <MoveHorizontal className="w-4" />}
            {`: ${diffPos.x / 10}`}
          </span>
          <span className="text-right flex gap-1 line-clamp-1 whitespace-nowrap font-medium">
            {diffPos.y > 0 && <ArrowDown className="w-4" />}
            {diffPos.y < 0 && <ArrowUp className="w-4" />}
            {diffPos.y === 0 && <MoveVertical className="w-4" />}
            {`: ${diffPos.y / -10}`}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 *:w-10 *:h-10 *:flex-shrink-0 w-fit">
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
      </div>
    </Draggable>
  )
}

