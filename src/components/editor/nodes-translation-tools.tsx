import { useEditorStore } from "./stores/editor-store"
import { Switch } from "@nextui-org/react";

export default function NodesTranslationTools({
}: {
  }) {
  const editor = useEditorStore()

  return (
    <div
      className='flex flex-col gap-4'
    >


      <Switch
        size="sm"
        classNames={{
          wrapper: "bg-secondary/70"
        }}
      >
        Enable grid snaping
      </Switch>

      <Switch
        size="sm"
        classNames={{
          wrapper: "bg-secondary/70"
        }}
      >
        Relative translation
      </Switch>

    </div>
  )
}
