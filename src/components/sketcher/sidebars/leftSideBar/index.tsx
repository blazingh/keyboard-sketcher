"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, PencilRuler } from "lucide-react"
import { useState } from "react"
import PerforanceTab from "./performance-tab"
import KeyboardModelsTab from "./keyboardmodels-tab"
import { Separator } from "@/components/ui/separator"
import { useModelActions } from "@/hooks/model-actions"
import { useNodes } from "reactflow"

export default function LeftSidebar() {

  const [settingsOpen, setSettingsOpen] = useState(false)

  const modelActions = useModelActions()

  const nodes = useNodes()

  const [selectedTab, setSelectedTab] = useState({
    visible: false as Boolean,
    title: 'Performance' as string,
    content: () => null as unknown as JSX.Element
  })

  return (
    <div className={cn(
      "fixed h-svh z-30 top-0 left-0 transition-all  ease-in-out w-[280px]",
      settingsOpen ? "shadow-xl" : "-translate-x-[279px] shadow-none"
    )}
    >
      {/* side bar toggle button */}
      <Button
        onClick={() => setSettingsOpen(p => !p)}
        className={cn(
          'absolute top-4 right-0 transition-all ease-in-out py-6 z-20 translate-x-full rounded-l-none',
          'flex items-center justify-center',
          settingsOpen ? "px-2 pl-1" : "px-3 pl-2"
        )}
      >
        <PencilRuler className='w-5 h-5' />
      </Button>


      {/* tabs content */}
      <div
        className={cn(
          "w-full h-full overflow-hidden flex flex-col p-4 gap-4 relative border-r-2 border-primary bg-background",
          settingsOpen && "rounded-r-2xl"
        )}
      >
        <div
          className={cn(
            "w-full h-full bg-background absolute top-0 left-0 transition-transform z-10 p-4 flex flex-col gap-4",
            selectedTab.visible ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex gap-2 border-b border-primary pb-2">
            <Button
              variant="outline"
              className=" border-0 border-white w-8 h-8 p-0"
              onClick={() => setSelectedTab(p => ({ ...p, visible: !p.visible }))}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <span className="text-lg font-semibold">
              {selectedTab.title}
            </span>
          </div>

          {<selectedTab.content />}

        </div>

        {/* content starts here */}

        <Button
          variant="outline"
          onClick={() => setSelectedTab({ visible: true, title: "Keyboard Model", content: KeyboardModelsTab })}
        >
          Keyboard Model
        </Button>

        <Button
          variant="outline"
          onClick={() => setSelectedTab({ visible: true, title: "Performance", content: PerforanceTab })}
        >
          Performance
        </Button>

        <div className="absolute bottom-0 left-0 w-full flex flex-col gap-4 p-4">
          <Separator />
          <Button
            className='w-full'
            onClick={() => {
              modelActions.generateModel(nodes)
              setSettingsOpen(false)
            }}
          >
            Generate Model
          </Button>
          <modelActions.ModelPreviewJsx />
        </div>


      </div >

    </div >
  )
}
