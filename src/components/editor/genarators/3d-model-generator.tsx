import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectValue, SelectItem, SelectContent, SelectTrigger } from "@/components/ui/select";
import { HelpCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { modelAOptionsList } from "@/workers/model-a-options";
import { useThreeDModelGeneratorStore } from "../stores/3d-model-generator-store";
import InputWithKeypad from "@/components/virtual-numpad-input";
import { useEditorStore } from "../stores/editor-store";
import { GeomsStlPreview } from "@/components/geoms-stl-preview";
import { useEffect } from "react";
import StlViewer from "@/components/stlViewer/stl-viewer";
import { CSG2Geom } from "@/lib/geometries";

export default function ThreeDModelGenerator() {
  return (
    <div className="h-[90svh] flex flex-col-reverse lg:flex-row gap-2">

      <div className="w-full lg:w-[350px] h-full border rounded relative overflow-hidden">
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
                <InputWithKeypad
                  label={option.label}
                  defaultValue={String(store.params[option.key])}
                  onValueChange={(v) => {
                    store.updateParam(option.key, v)
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
  const store = useThreeDModelGeneratorStore()
  const { nodes } = useEditorStore((state) => ({ nodes: state.nodesArray }))

  useEffect(() => {
    store.generateModel(nodes())
  }, [store.params])

  return (
    <>
      {/* loader overlay */}
      {store.worker && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center pointer-events-none z-10">
          <Loader2 className="w-10 lg:w-16 h-10 lg:h-16 animate-spin" />
        </div>
      )}

      {store.generatedGeoms && (
        <StlViewer
          geoms={[CSG2Geom(store.generatedGeoms[0].geom), CSG2Geom(store.generatedGeoms[1].geom)]}
          url="https://storage.googleapis.com/ucloud-v3/ccab50f18fb14c91ccca300a.stl"
          orbitControls
          shadows
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </>
  )
}
