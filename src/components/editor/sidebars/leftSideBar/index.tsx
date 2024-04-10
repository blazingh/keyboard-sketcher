"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Blocks, ChevronLeft } from "lucide-react"
import { useContext, useState } from "react"
import KeyboardModelsTab from "./keyboardmodels-tab"
import { Separator } from "@/components/ui/separator"
import { useNodes } from "reactflow"
import { workSpaceContext } from "@/contexts/workspace-context"
import PreferanceTab from "./preferance-tab"
import { ModelContext } from "@/contexts/model-context"

export default function LeftSidebar() {

  const model = useContext(ModelContext)
  const workspace = useContext(workSpaceContext)

  const nodes = useNodes()

  const [selectedTab, setSelectedTab] = useState({
    visible: false as Boolean,
    title: 'Performance' as string,
    content: () => null as unknown as JSX.Element
  })

  const open = workspace?.options.openBar === "left"

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
        onClick={() => workspace?.updateOption("openBar", open ? "" : "left")}
        className={cn(
          'absolute transition-all ease-in-out py-6 z-20 rounded-b-none md:rounded-l-none md:rounded-r-md',
          "top-0 md:top-5 left-5 md:right-0 md:left-[unset] -translate-y-full md:translate-y-0 md:translate-x-full",
          'flex items-center justify-center p-3 md:px-2 border border-primary',
          !open && workspace?.options.openBar !== "" && "-translate-y-[calc(100%+278px)] md:translate-x-[calc(100%+278px)] md:translate-y-0"
        )}
      >
        <Blocks className='w-5 h-5 md:w-6 md:h-6' />
      </Button>


      {/* tabs content */}
      <div
        className={cn(
          "w-full h-full overflow-hidden flex flex-col p-4 gap-4 relative border-2 border-primary bg-background",
          open && "rounded-t-2xl md:rounded-r-2xl md:rounded-l-none"
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
          onClick={() => setSelectedTab({ visible: true, title: "Editor Preferance", content: PreferanceTab })}
        >
          Editor Performance
        </Button>

        <div className="absolute bottom-0 left-0 w-full flex flex-col gap-4 p-4">
          <Separator />
          <Button
            className='w-full'
            onClick={() => {
              model?.generateModel(nodes)
              workspace?.updateOption("openBar", "")
            }}
          >
            Generate Model
          </Button>
        </div>


      </div >

    </div >
  )
}
