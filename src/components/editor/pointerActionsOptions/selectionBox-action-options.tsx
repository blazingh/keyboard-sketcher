import { useEditorStore } from "@/components/editor/stores/editor-store"
import { Divider, Switch } from "@nextui-org/react";

export default function SelectionBoxActionOptions({
}: {
  }) {
  const editor = useEditorStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Selection Options
      </span>

      <Divider />

      <Switch
        size="sm"
      >
        Include Switches
      </Switch>

      <Switch
        size="sm"
      >
        Include Controllers
      </Switch>

    </div>
  )
}
