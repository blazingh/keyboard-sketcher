'use client'
import { workSpaceContext } from "@/contexts/workspace-context";
import { useContext } from "react";
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { modelOptions } from "@/workers/model-a-options";
import { Input } from "@/components/ui/input";
import { HelperTooltip } from "@/components/helper-tooltip";

export default function KeyboardModelsTab() {

  const wsc = useContext(workSpaceContext)

  return (
    <div className="flex flex-col gap-4" >

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm">Base Model</label>
          <HelpCircle className="w-5 h-5" />
        </div>
        <Select defaultValue="a" >
          <SelectTrigger>
            <SelectValue placeholder="base model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Model A</SelectItem>
            <SelectItem value="b" disabled>Model B</SelectItem>
            <SelectItem value="c" disabled>Model C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {modelOptions.map((option) => {
        if (option.type === "number")
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">{option.label}</label>
                <HelperTooltip desc={option.description} />
              </div>
              <Input type="number" />
            </div>
          )
        return null
      })}

    </div >
  )
}
