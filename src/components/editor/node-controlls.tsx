"use client"
import { Button } from "@/components/ui/button"
import { EditorContext } from "@/contexts/editor-context"
import { workSpaceContext } from "@/contexts/workspace-context"
import { calculateCenterPosition } from "@/lib/positions"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, MoveHorizontal, MoveVertical, RefreshCw, History, Trash2 } from "lucide-react"
import { useContext } from "react"


export default function NodesControll() {

  const editor = useContext(EditorContext)
  const workspace = useContext(workSpaceContext)

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

  const visible = editor && editor.selectedNodes.length > 0 && workspace?.options.showNodeController

  if (!editor) return null

  return (
    <div
      className={cn(
        "absolute z-20 top-0 left-1/2 -translate-x-1/2",
      )}
    >
      <div
        className={cn(
          "w-fit h-fit overflow-hidden",
          "bg-background p-2 md:px-4 rounded-b-lg border-2 border-primary border-t-0",
          "flex flex-col gap-2",
          visible ? "animate-pop-in" : "hidden"
        )}
      >
        <div className="col-span-3 flex items-center justify-between w-full gap-4">
          <span className="flex gap-1 line-clamp-1 whitespace-nowrap">
            {diffPos.x > 0 && <ArrowRight className="w-4" />}
            {diffPos.x < 0 && <ArrowLeft className="w-4" />}
            {diffPos.x === 0 && <MoveHorizontal className="w-4" />}
            {`: ${Math.max(diffPos.x / -10, diffPos.x)}`}
          </span>
          <span className="flex gap-1 line-clamp-1 whitespace-nowrap font-medium">
            {diffPos.y > 0 && <ArrowDown className="w-4" />}
            {diffPos.y < 0 && <ArrowUp className="w-4" />}
            {diffPos.y === 0 && <MoveVertical className="w-4" />}
            {`: ${Math.max(diffPos.y / -10, diffPos.y)}`}
          </span>
          <span className="flex gap-1 line-clamp-1 whitespace-nowrap font-medium">
            <RefreshCw className='w-4' />
            {": 0"}
          </span>
          <Button variant="white" className='w-8 h-8 rounded-[4px]' >
            <History className='w-5 flex-shrink-0' />
          </Button>
          <Button variant="destructive" className='w-8 h-8 rounded-[4px]' >
            <Trash2 className='w-5 flex-shrink-0' />
          </Button>
        </div>
      </div>
    </div>
  )
}

