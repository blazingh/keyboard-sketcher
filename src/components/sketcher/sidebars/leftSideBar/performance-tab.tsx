'use client'
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { workSpaceOptionsContext } from "@/contexts/workspace";
import { useContext } from "react";

export default function PerforanceTab() {
  const wsc = useContext(workSpaceOptionsContext)
  return (
    <div className="flex flex-col gap-2" >

      <div className="flex items-center space-x-2">
        <Label htmlFor="render-outline">
          Render case outline
        </Label>
        <Switch
          id="render-outline"
          checked={wsc?.options.renderOuline}
          onCheckedChange={(v) => wsc?.updateOption('renderOuline', v)}
        />
      </div>

    </div >
  )
}
