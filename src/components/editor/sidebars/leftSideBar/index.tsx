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
import { ScrollArea } from "@/components/ui/scroll-area"

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
      "fixed bottom-0 left-0 transition-all ease-in-out w-[282px] h-svh z-20",
      !open && "-translate-x-[280px]",
    )}
    >
      {/* side bar toggle button */}
      <Button
        variant={open ? "default" : "secondary"}
        onClick={() => workspace?.updateOption("openBar", open ? "" : "left")}
        className={cn(
          'absolute transition-all ease-in-out py-6 z-20 rounded-l-none',
          "top-5 right-0 translate-x-full",
          'flex items-center justify-center p-3 md:px-2 border border-primary border-l-0',
          !open && workspace?.options.openBar !== "" && "translate-x-[calc(100%+278px)]"
        )}
      >
        <Blocks className='w-5 h-5 md:w-6 md:h-6' />
      </Button>


      {/* tabs content */}
      <div
        className={cn(
          "w-full h-full overflow-hidden flex flex-col p-4 gap-4 relative border-r-2 border-primary bg-background",
          open && "rounded-r-2xl"
        )}
      >

        <div
          className={cn(
            "w-full h-full bg-background absolute top-0 left-0 transition-transform z-10 p-4 pr-0 flex flex-col gap-4",
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

          <ScrollArea className="h-[calc(100%-8rem)] w-full p-0 pr-4">
            {<selectedTab.content />}
          </ScrollArea>

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

        <div className="absolute bottom-0 left-0 w-full flex flex-col gap-4 p-4 z-10">
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
