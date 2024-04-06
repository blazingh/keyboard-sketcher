'use client'
import { workSpaceOptionsContext } from "@/contexts/workspace";
import { useContext } from "react";
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";

export default function KeyboardModelsTab() {

  const wsc = useContext(workSpaceOptionsContext)

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

    </div >
  )
}
