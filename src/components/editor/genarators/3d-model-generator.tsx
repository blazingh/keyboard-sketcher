import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { HelpCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { modelAOptionsList } from "@/workers/model-a-options";
import { HelperTooltip } from "@/components/helper-tooltip";
import { Input } from "@/components/ui/input";
import { useThreeDModelGeneratorStore } from "../stores/3d-model-generator-store";
import { Button } from "@/components/ui/button";

export default function ThreeDModelGenerator() {
  return (
    <div className="w-full h-[90svh] flex flex-col-reverse lg:flex-row gap-2">
      <div className="w-full lg:w-[350px] h-full lg:h-full border rounded relative overflow-hidden">
        <ModelGeneratorOptions />
      </div>
      <div className="w-full h-full rounded relative overflow-hidden">
        <ModelGeneratorPreview />
      </div>
    </div>
  )
}

function ModelGeneratorOptions() {
  const store = useThreeDModelGeneratorStore()
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
                <div className="flex items-end justify-between">
                  <label className="text-sm">{option.label}</label>
                  <HelperTooltip desc={option.description} />
                </div>
                <Input
                  defaultValue={String(store.params[option.key])}
                  onChange={(e) => {
                    console.log(e.target.value)
                    store.updateParam(option.key, e.target.value)
                  }} />
              </div>
            )
          return null
        })}
      </div>
      <ScrollBar />
    </ScrollArea>
  )
}

function ModelGeneratorPreview() {
  return (
    <div className="w-full h-full">
      {/* loader overlay */}
      {true && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-10 lg:w-16 h-10 lg:h-16 animate-spin" />
        </div>
      )}
    </div>
  )
}
