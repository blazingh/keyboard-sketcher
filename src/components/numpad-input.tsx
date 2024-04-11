
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

  const ref = useRef<any>()

  const onChange = (input: string) => {
    let newValue = input || "0"
    if (newValue.slice(-1) === "-") newValue = newValue.slice(0, -1)
    if (newValue.slice(0, 1) === "0" && newValue.slice(0, 2) !== "0." && newValue.length > 1) newValue = newValue.slice(1, newValue.length)
    onValueChange(newValue)
    // console.log("Input changed", ref.current);
    if (!ref.current) return
    ref.current.setInput(newValue)
  }

  const onKeyPress = (button: any) => {
    if (button === "-")
      onValueChange(String(parseFloat(value) * -1))
    //  console.log("Button pressed", button);
  }

  useEffect(() => {
    if (!ref.current) return
    ref.current.setInput(value)
  }, [value, ref])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <Input
          readOnly
          value={value}
          className={open ? "outline outline-primary" : ""}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='p-0 border-none my-1 shadow'>
        <div className='animate-jump-in animate-duration-200 animate-ease-in-out'>
          <Keyboard
            keyboardRef={r => ref.current = r}
            onInit={k => k.setInput(value)}
            onChange={onChange}
            onKeyPress={onKeyPress}
            theme='bg-secondary w-fit rounded-md border p-2'
            useButtonTag
            buttonTheme={[
              {
                class: buttonVariants({ variant: "white" }) + " rounded-[4px] m-1 w-10 h-10",
                buttons: "1 2 3 4 5 6 7 8 9 0 - ."
              },
              {
                class: buttonVariants({ variant: "white" }) + " rounded-[4px] m-1 w-[138px] h-10",
                buttons: "{bksp}"
              },
            ]}
            layoutName='default'
            layout={{
              default: [
                "7 8 9 ",
                "4 5 6",
                "1 2 3",
                "- 0 .",
                "{bksp}"
              ]
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

