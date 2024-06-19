import { useEditorStore } from "@/components/editor/stores/editor-store"
import InputWithKeypad from "@/components/virtual-numpad-input";
import { Divider, Switch } from "@nextui-org/react";

export default function CopyActionOptions({
}: {
  }) {
  const editor = useEditorStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Copy Options
      </span>

      <Divider />

      <InputWithKeypad
        size="sm"
        label="Spacing"
      />

      <Switch
        size="sm"
      >
        Relative positioning
      </Switch>

    </div>
  )
}
