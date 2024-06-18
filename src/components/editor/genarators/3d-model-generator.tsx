import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronDown, FileBox, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModelWorkerResult, modelAOptionsList } from "@/workers/model-a-options";
import { useThreeDModelGeneratorStore } from "../stores/3d-model-generator-store";
import InputWithKeypad from "@/components/virtual-numpad-input";
import { useEditorStore } from "../stores/editor-store";
import { useEffect, useState } from "react";
import StlViewer from "@/components/stlViewer/stl-viewer";
import { CSG2Geom } from "@/lib/geometries";
import { Button, DropdownMenu, Switch, DropdownItem, DropdownTrigger, Dropdown, Select, SelectItem } from "@nextui-org/react";
import { STLExporter } from "three-stdlib";
import { Mesh } from "three";

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
  const { nodes } = useEditorStore((state) => ({ nodes: state.nodesArray }))
  return (
    <ScrollArea className="w-full h-full">
      <div className="w-full flex flex-col gap-4 p-4">

        <Select
          disallowEmptySelection
          label="Base Model"
          defaultSelectedKeys={["a"]}
          disabledKeys={["b"]}
        >
          <SelectItem key={"a"} >Model A</SelectItem>
          <SelectItem key={"b"} >Model B</SelectItem>
        </Select>

        <Separator />

        <Button
          color="primary"
          onPress={() => { store.generateModel(nodes()) }}
        >
          generate
        </Button>

        {modelAOptionsList.map((option) => {
          if (option.type === "number")
            return (
              <div key={option.id} className="flex flex-col gap-2">
                <InputWithKeypad
                  label={option.label}
                  defaultValue={String(store.params[option.key])}
                  endContent={<span className="text-xs italic">mm</span>}
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
  const [hiddenGeoms, setHiddenGeoms] = useState<any[]>([])
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

      {store.generatedGeoms.length != 0 && (
        <>
          <div className="absolute top-2 left-0 flex flex-col gap-2">
            {store.generatedGeoms.map((csg: ModelWorkerResult["geometries"][number]) => (
              <Switch
                key={csg.id}
                isSelected={!hiddenGeoms.includes(csg.id)}
                onValueChange={() => {
                  setHiddenGeoms(p =>
                    p.includes(csg.id)
                      ? p.filter(el => el !== csg.id)
                      : [...p, csg.id]
                  )
                }}
              >
                {csg.label}
              </Switch>
            ))}
          </div>
          <div className="absolute bottom-4 right-4">
            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" endContent={<ChevronDown />}>
                  Download
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {store.generatedGeoms.map((csg: ModelWorkerResult["geometries"][number]) => (
                  <DropdownItem
                    key={csg.id}
                    onPress={() => {
                      const exporter = new STLExporter()
                      const buffer = exporter.parse(
                        new Mesh(CSG2Geom(csg.geom)),
                        { binary: true }
                      )
                      const link = document.createElement('a');
                      const blob = new Blob([buffer], { type: 'application/octet-stream' })
                      link.href = URL.createObjectURL(blob)
                      link.download = `${csg.label}.stl`
                      link.click()
                    }}
                    startContent={<FileBox className="mr-2" />}
                  >
                    {csg.label}.stl
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <StlViewer
            geoms={
              store.generatedGeoms.filter(csg => !hiddenGeoms.includes(csg.id)).map(csg => CSG2Geom(csg.geom))
            }
            orbitControls
            shadows
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </>
      )}
    </>
  )
}
