"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ToastPendingModel({
  onActionClick
}: {
  onActionClick: () => void
}) {
  return (
    <div className='w-full h-full flex items-center justify-between'>
      <span className='flex items-center gap-2'>
        <Loader2 className='w-5 h-5 animate-spin' />
        Generating Model...
      </span>
      <Button
        size="sm"
        variant={"destructive"}
        className='h-6 rounded-sm text-xs'
        onClick={onActionClick}
      >
        Cancel
      </Button>
    </div>
  )
}

