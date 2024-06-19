import { useEditorStore } from "@/components/editor/stores/editor-store"
import { Button, Divider } from "@nextui-org/react";

export default function RulerActionOptions({
}: {
  }) {
  const editor = useEditorStore()

  return (
    <div
      className='flex flex-col gap-2'
    >

      <span className="w-full text-center">
        Ruler Options
      </span>

      <Divider />

      <Button
        size="sm"
      >
        Clear Selection
      </Button>

    </div>
  )
}
