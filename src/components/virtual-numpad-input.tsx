"use client"
import { ReactNode, useEffect, useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Check, Delete, Trash, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, InputProps, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

export default function InputWithKeypad({ onValueChange, defaultValue, ...props }: { onValueChange?: (v: string) => void } & InputProps) {

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  useEffect(() => {
    setValue(String(defaultValue))
  }, [defaultValue])

  function handleCancel() {
    setValue(String(defaultValue))
    setOpen(false)
  }

  function handleDone() {
    onValueChange?.(value)
    setOpen(false)
  }

  function handleInput(key: typeof buttons[0]) {
    switch (key.id) {
      case ".":
        if (!value.includes("."))
          setValue(p => p + key.id)
        break;

      case "pn":
        if (value[0] === "-")
          setValue(p => p.slice(1))
        else
          setValue(p => "-" + p)
        break;

      case "del":
        if (value.length === 1)
          setValue("0")
        else
          setValue(p => p.slice(0, -1))
        break;

      case "null":
        setValue("0")
        break;

      case "X":
        handleCancel()
        break;

      case "D":
        handleDone()
        break;

      default:
        if (value === "0")
          setValue(key.id)
        else
          setValue(p => p + key.id)
        break;
    }
  }

  return (
    <Popover isOpen={open} onOpenChange={setOpen} placement="right" >
      <PopoverTrigger>
        <div>
          <Input
            /* @ts-ignore */
            {...props}
            /* @ts-ignore */
            classNames={{
              inputWrapper: open && "ring-2 ring-ring"
            }}
            className={cn(
              props.className,
              "pointer-events-none",
            )}
            value={value}
            readOnly
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit p-2">

        <div className="grid grid-cols-4 *:w-8 *:h-8 w-fit gap-1">
          {buttons.map((key) => (
            <Button
              variant={key.variant}
              key={key.id}
              className="*:shrink-0 *:w-5 *:h-5 font-semibold"
              onClick={() => {
                handleInput(key)
              }}
            >
              {key.char}
            </Button>
          ))}
        </div>

      </PopoverContent>
    </Popover>
  )
}

const buttons: {
  id: string,
  char: ReactNode,
  variant: ButtonProps["variant"]
}[] = [
    { id: "7", char: "7", variant: "white" },
    { id: "8", char: "8", variant: "white" },
    { id: "9", char: "9", variant: "white" },
    { id: "del", char: <Delete />, variant: "secondary" },

    { id: "4", char: "4", variant: "white" },
    { id: "5", char: "5", variant: "white" },
    { id: "6", char: "6", variant: "white" },
    { id: "null", char: <Trash2 className="text-destructive" />, variant: "secondary" },

    { id: "1", char: "1", variant: "white" },
    { id: "2", char: "2", variant: "white" },
    { id: "3", char: "3", variant: "white" },
    { id: "X", char: <X />, variant: "destructive" },

    { id: ".", char: ".", variant: "white" },
    { id: "0", char: "0", variant: "white" },
    { id: "pn", char: "+/-", variant: "white" },
    { id: "D", char: <Check />, variant: "default" },
  ]

