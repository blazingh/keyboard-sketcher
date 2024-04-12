
"use client"
import { buttonVariants } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';

export default function NumpadInput({
  value,
  onValueChange,
}: {
  value: string,
  onValueChange: (value: string) => void
}) {

  const [open, setOpen] = useState(false)

  const [originalValue, setOriginalValue] = useState(value)

  const ref = useRef<any>()

  const onKeyPress = (button: any) => {
    switch (button) {
      case "{bksp}": // backspace
        onValueChange(value.slice(0, -1))
        break;
      case "d": // done
        setOriginalValue(value)
        setOpen(false)
        break;
      case "e": // exit
        onValueChange(originalValue)
        setOpen(false)
        break;
      case "C": // clear
        onValueChange("0")
        break;
      case "p": // positive negative
        onValueChange(String(parseFloat(value) * -1))
        break;
      case ".": // dot
        onValueChange(value.includes(".") ? value : value + button)
        break;
      default:
        onValueChange(value === "0" ? button : value + button)
        break;
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Input
          readOnly
          value={value}
          className={open ? "border-2 border-primary" : ""}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='p-0 border-none my-0 shadow'>
        <div className='animate-pop-in'>
          <Keyboard
            keyboardRef={r => ref.current = r}
            onInit={k => k.setInput(value)}
            //         onChange={onChange}
            onKeyReleased={onKeyPress}
            theme='bg-secondary w-fit rounded-md border p-2'
            useButtonTag
            display={{
              "p": "+/-",
              "{bksp}": "<",
              "d": "✓",
              "e": "X",
            }}
            buttonTheme={[
              {
                class: buttonVariants({ variant: "white" }) + " rounded-[2px] m-0.5 w-8 h-8 md:w-10 md:h-10",
                buttons: "1 2 3 4 5 6 7 8 9 0 - . p C {bksp}"
              },
              {
                class: buttonVariants({ variant: "default" }) + " rounded-[2px] m-0.5 w-8 h-8 md:w-10 md:h-10",
                buttons: "d"
              },
              {
                class: buttonVariants({ variant: "destructive" }) + " rounded-[2px] m-0.5 w-8 h-8 md:w-10 md:h-10",
                buttons: "e"
              },
            ]}
            layoutName='default'
            layout={{
              default: [
                "7 8 9 {bksp}",
                "4 5 6 d",
                "1 2 3 e",
                ". 0 p C",
              ]
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

