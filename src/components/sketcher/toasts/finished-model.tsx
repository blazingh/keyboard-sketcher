"use client"
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ToastFinishModel({
  totalTime,
  onActionClick
}: {
  totalTime: number
  onActionClick: () => void
}) {
  return (
    <div className='w-full h-full flex items-center justify-between'>
      <span className='flex items-center gap-2'>
        <CheckCircle2 className='w-5 h-5' />
        Model Generated in {totalTime / 1000}s
      </span>
      <Button
        size="sm"
        className='h-6 rounded-sm text-xs'
        onClick={onActionClick}
      >
        View
      </Button>
    </div>
  )
}

