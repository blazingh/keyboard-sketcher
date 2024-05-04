'use client'
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { workSpaceContext } from "@/contexts/workspace-context";
import { useContext } from "react";

export default function PreferanceTab() {
  const wsc = useContext(workSpaceContext)
  return (
    <div className="flex flex-col gap-4" >

      <div className="flex w-full justify-between items-center">
        <Label htmlFor="render-outline">
          Render case outline
        </Label>
        <Switch
          id="render-outline"
          checked={wsc?.options.renderOuline}
          onCheckedChange={(v) => wsc?.updateOption('renderOuline', v)}
        />
      </div>

      <div className="flex w-full justify-between items-center">
        <Label htmlFor="render-outline">
          Show nodes controller
        </Label>
        <Switch
          id="render-outline"
          checked={wsc?.options.showNodeController}
          onCheckedChange={(v) => wsc?.updateOption('showNodeController', v)}
        />
      </div>

    </div >
  )
}
