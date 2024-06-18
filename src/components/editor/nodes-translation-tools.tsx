import { useEditorStore } from "./stores/editor-store"
import { Checkbox } from "@nextui-org/react";

export default function NodesTranslationTools({
}: {
  }) {
  const editor = useEditorStore()

  return (
    <div
      className='flex flex-col gap-4'
    >

      <Checkbox
        size="sm"
      >
        Enable grid snaping
      </Checkbox>

      <Checkbox
        size="sm"
      >
        Relative translation
      </Checkbox>

    </div>
  )
}
