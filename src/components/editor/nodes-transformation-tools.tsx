import { cn } from "@/lib/utils"
import { Node, useEditorStore } from "./stores/editor-store"
import { findEnclosingBox } from "./lib/nodes-utils"
import { MoveHorizontal, MoveVertical, RotateCcw, RotateCw } from "lucide-react"
import { produce } from "immer"
import { useViewportTransformationStore } from "./stores/viewport-transformation-store"
import { useGesture } from "@use-gesture/react"
import { Button } from "../ui/button"

export default function NodesTranformationTools({
}: {
  }) {
  const store = useEditorStore()
  const { transformMatrix } = useViewportTransformationStore()

  const nodes: Node[] = store.activeNodes.map((nodeId) => {
    return produce(store.nodes[nodeId], draft => {
      draft.pos.x += store.activeDisplacement.x
      draft.pos.y += store.activeDisplacement.y
    })
  })

  const toolbarBox = findEnclosingBox(nodes)

  const { x: dx, y: dy, r: dr } = store.activeDisplacement
  const { x: tx, y: ty, s: ts } = transformMatrix

  const bindsDragY = useGesture({
    onDrag: ({ movement }) => {
      const displacement = {
        x: Math.round((movement[0] / ts) / 10) * 10,
        y: Math.round((movement[1] / ts) / 10) * 10,
        r: 0
      }
      store.setActiveDisplacement(displacement)
    },
    onDragEnd: () => {
      store.moveActiveNodes(store.activeDisplacement)
      store.setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }
  }, {
    drag: { axis: "y" }
  })

  const bindsDragX = useGesture({
    onDrag: ({ movement }) => {
      const displacement = {
        x: Math.round((movement[0] / ts) / 10) * 10,
        y: Math.round((movement[1] / ts) / 10) * 10,
        r: 0
      }
      store.setActiveDisplacement(displacement)
    },
    onDragEnd: () => {
      store.moveActiveNodes(store.activeDisplacement)
      store.setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }
  }, {
    drag: { axis: "x" }
  })

  const bindsDragR = useGesture({
    onDrag: ({ movement }) => {
      if (!toolbarBox) return
      const ogAngle = getAngleFromCoordinates({
        x: toolbarBox.x + toolbarBox.width / 2,
        y: toolbarBox.y + toolbarBox.height / 2,
      }, {
        x: toolbarBox.x + toolbarBox.width,
        y: toolbarBox.y,
      })
      const newAngle = getAngleFromCoordinates({
        x: toolbarBox.x + toolbarBox.width / 2,
        y: toolbarBox.y + toolbarBox.height / 2,
      }, {
        x: toolbarBox.x + toolbarBox.width + movement[0],
        y: toolbarBox.y + movement[1],
      })
      const displacement = {
        x: 0,  //Math.round((movement[0] / ts) / 10) * 10,
        y: 0, //Math.round((movement[1] / ts) / 10) * 10,
        r: Math.round((newAngle - ogAngle) / 5) * 5
      }
      store.setActiveDisplacement(displacement)
    },
    onDragEnd: () => {
      store.moveActiveNodes(store.activeDisplacement)
      store.setActiveDisplacement({ x: 0, y: 0, r: 0 })
    }
  }, {
  })

  if (false
    || !store.activeNodes
    || !toolbarBox
  ) return null

  const { x, y, width: w, height: h } = toolbarBox

  const pos = {
    left: x * ts + tx,
    top: y * ts + ty,
    width: w * ts,
    height: h * ts
  }

  return (
    <>
      <div
        className={cn(
          'absolute pointer-events-none',
        )}
        style={{ ...pos }}
      >
        {/* bottom left transaltion handels */}
        <div
          className={cn(
            'absolute top-1/2 -left-5 transition-all pointer-events-auto',
            (dx !== 0 || dr !== 0) && "hidden"
          )}
          style={{
            transform: `scale(${ts})`
          }}
        >
          <Button
            variant={"ghost"}
            className="h-10 w-6 p-0 absolute -translate-y-1/2 -translate-x-1/2 touch-none"
            {...bindsDragY()}
          >
            <MoveVertical
              className="h-10 w-10 shrink-0 pointer-events-none"
            />
          </Button>
        </div>
        {/* bottom left transaltion handels */}
        <div
          className={cn(
            'absolute -bottom-5 left-1/2 transition-all pointer-events-auto',
            (dy !== 0 || dr !== 0) && "hidden"
          )}
          style={{
            transform: `scale(${ts}) `
          }}
        >
          <Button
            variant={"ghost"}
            className="h-6 w-10 p-0 absolute -translate-y-1/2 -translate-x-1/2  hover:cursor-grab active:cursor-grabbing touch-none"
            {...bindsDragX()}
          >
            <MoveHorizontal
              className=" w-10 h-10 shrink-0 pointer-events-none"
            />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          'absolute pointer-events-none',
        )}
        style={{
          ...pos,
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `rotate(${dr}deg)`
        }}
      >
        {/* top rigth rotaion handle */}
        <div
          className={cn(
            'absolute -top-3 -right-11 transition-all flex items-start justify-start overflow-hidden h-[15px] w-14 pointer-events-auto',
            (dy !== 0 || dx !== 0) && "hidden"
          )}
          style={{
            transform: `scale(${ts}) rotate(45deg)`
          }}
        >
          <div className="group absolute hover:cursor-grab active:cursor-grabbing touch-none w-10 h-10" {...bindsDragR()}>
            <RotateCw className="h-10 w-10 absolute group-active:stroke-primary" />
            <RotateCcw className="h-10 w-10 absolute group-active:stroke-primary" />
          </div>
        </div>
      </div>
    </>
  )
}

function getAngleFromCoordinates(center: any, pointer: any) {
  // Calculate the difference in coordinates
  const deltaX = pointer.x - center.x;
  const deltaY = pointer.y - center.y;

  // Calculate the angle in radians
  let angleInRadians = Math.atan2(deltaY, deltaX);

  // Convert the angle to degrees
  let angleInDegrees = angleInRadians * (180 / Math.PI);

  // Ensure the angle is positive (0 to 360 degrees)
  if (angleInDegrees < 0) {
    angleInDegrees += 360;
  }

  return angleInDegrees;
}
