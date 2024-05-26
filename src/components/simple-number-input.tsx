
"use client"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input, InputProps } from "./ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export default function SimpleNumberInput(props: { onValueChange?: (v: number) => void } & InputProps) {

  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(parseInt(String(props.defaultValue)))
  }, [props.defaultValue])

  return (
    <div className="relative">
      <Input {...props}
        className={cn(
          props.className,
          "pointer-events-none px-12 text-center",
        )}
        value={props.defaultValue}
      />

      <Button
        variant={"white"}
        className="absolute top-2 right-2 p-0 w-6 h-6"
        onClick={() => {
          props.onValueChange?.(value + 1)
        }}
      >
        <Plus className="shrink-0" />
      </Button>

      <Button
        variant={"white"}
        className="absolute top-2 left-2 p-0 w-6 h-6"
        onClick={() => {
          props.onValueChange?.(value - 1)
        }}
      >
        <Minus className="shrink-0" />
      </Button>
    </div>
  )
}
