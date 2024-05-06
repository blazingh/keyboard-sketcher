import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { modelAOptionsList } from "@/workers/model-a-options";
import { HelperTooltip } from "@/components/helper-tooltip";
import { Input } from "@/components/ui/input";

export default function ThreeDModelGenerator() {
  return (
    <div className="w-full h-[90svh] flex flex-col-reverse lg:flex-row gap-2">
      <div className="w-full lg:w-[350px] h-1/2 lg:h-full border rounded">
        <ModelGeneratorOptions />
      </div>
      <div className="w-full h-full bg-slate-300 rounded">
      </div>
    </div>
  )
}

function ModelGeneratorOptions() {
  return (
    <ScrollArea className="w-full h-full">
      <div className="w-full flex flex-col gap-4 p-4">

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">Base Model</label>
            <HelpCircle className="w-5 h-5" />
          </div>
          <Select defaultValue={"a"} >
            <SelectTrigger>
              <SelectValue placeholder="base model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Model A</SelectItem>
              <SelectItem value="soon" disabled>Model B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {modelAOptionsList.map((option) => {
          if (option.type === "number")
            return (
              <div key={option.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">{option.label}</label>
                  <HelperTooltip desc={option.description} />
                </div>
                <Input />
              </div>
            )
          return null
        })}
      </div>
      <ScrollBar />
    </ScrollArea>
  )
}
