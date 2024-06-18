import { useEditorStore } from "@/components/editor/stores/editor-store"
import { Divider, Switch } from "@nextui-org/react";

export default function TransformationActionOptions({
}: {
  }) {
  const editor = useEditorStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Transformation Options
      </span>

      <Divider />

      <Switch
        size="sm"
      >
        Enable grid snaping
      </Switch>

      <Switch
        size="sm"
      >
        Enable rotation snaping
      </Switch>

      <Switch
        size="sm"
      >
        Relative translation
      </Switch>

    </div>
  )
}
