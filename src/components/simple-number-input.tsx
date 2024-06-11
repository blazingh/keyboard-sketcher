
"use client"
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { Button, Input, InputProps } from "@nextui-org/react";

export default function SimpleNumberInput({ onNumberChange, defaultValue, ...props }: InputProps & { onNumberChange?: (v: number) => void }) {

  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(parseInt(defaultValue || "0"))
  }, [defaultValue])


  return (
    <div className="relative">
      <Input
        /* @ts-ignore */
        {...props}
        /* @ts-ignore */
        classNames={{
          input: "w-full text-center",
          label: "w-full text-center ml-2.5"
        }}
        className={cn(
          props.className,
          "pointer-events-none",
        )}
        value={String(value)}
        readOnly
      />

      <Button
        size={props.size}
        color="default"
        isIconOnly
        className="absolute bottom-2 right-2"
        onClick={() => {
          onNumberChange?.(value + 1)
        }}
      >
        <Plus className="shrink-0" />
      </Button>

      <Button
        size={props.size}
        color="default"
        isIconOnly
        className="absolute bottom-2 left-2"
        onClick={() => {
          onNumberChange?.(value - 1)
        }}
      >
        <Minus className="shrink-0" />
      </Button>
    </div>
  )
}
