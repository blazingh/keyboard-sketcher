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
      >
        Enable grid snaping
      </Checkbox>

      <Checkbox
      >
        Relative translation
      </Checkbox>

    </div>
  )
}
