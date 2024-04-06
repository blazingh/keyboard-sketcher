"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDetectClickOutside } from 'react-detect-click-outside';

export default function AddNodeButton() {
  const [open, setOpen] = useState(false)
  function toggle() {
    setOpen(p => !p)
  }
  const ref = useDetectClickOutside({ onTriggered: () => open && setOpen(false) });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all overflow-hidden duration-300 ease-in-out",
        open ? "h-[168px]" : "h-10"
      )}
    >
      <Button className="h-10 w-10" onClick={toggle}>
        <Plus className="flex-shrink-0" />
      </Button>
      <div className="flex flex-col items-start justify-start py-2 gap-2">
        <Button variant="secondary" onClick={toggle}>
          Switch
        </Button>
        <Button variant="secondary" onClick={toggle}>
          MCU
        </Button>
      </div>
    </div>
  )
}
