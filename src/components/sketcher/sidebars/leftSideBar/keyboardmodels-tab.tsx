'use client'
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { workSpaceOptionsContext } from "@/contexts/workspace";
import { useContext } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function KeyboardModelsTab() {
  const wsc = useContext(workSpaceOptionsContext)
  return (
    <div className="flex flex-col gap-4" >

      <Toggle
        variant="outline"
        className="data-[state=on]:bg-primary data-[state=on]:text-accent-foreground"
      >
        Model A
      </Toggle>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger >
            <Toggle
              variant="outline"
              disabled
            >
              Model B
            </Toggle>

          </TooltipTrigger>
          <TooltipContent>
            <p>Comming soon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger >
            <Toggle
              variant="outline"
              disabled
            >
              Model C
            </Toggle>

          </TooltipTrigger>
          <TooltipContent>
            <p>Comming soon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div >
  )
}
