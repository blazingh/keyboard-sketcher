import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, ButtonProps } from "@/components/ui/button"
import { ChevronDownSquareIcon, ChevronLeftSquareIcon, ChevronUpSquareIcon, InfoIcon } from "lucide-react"
import IconMouseMiddleClick from "@/icons/mouse-middle-click"
import IconMouseLeftClick from "@/icons/mouse-left-click"
import { Badge } from "../ui/badge"
import IconMouseRightclick from "@/icons/mouse-right-click"
import IconMouseScrollWheel from "@/icons/mouse-scroll-wheel"

export default function EditorDialogTrigger(props: ButtonProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          {...props}
        >
          <InfoIcon className='w-5 h-5' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ul className='flex flex-col gap-4 w-full'>
          <li className='flex flex-row gap-4 items-center text-sm w-full'>
            <b className='min-w-40'>
              Move/Pan view
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <IconMouseMiddleClick className='w-8 h-8' /> or <IconMouseRightclick className='w-8 h-8' />
            </span>
          </li>
          <li className='flex flex-row gap-4 items-center text-sm'>
            <b className='min-w-40'>
              Zoom in/out
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <IconMouseScrollWheel className='w-8 h-8' />
            </span>
          </li>
          <li className='flex flex-row gap-4 items-center text-sm'>
            <b className='min-w-40'>
              Select Item
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <IconMouseLeftClick className='w-8 h-8' />
            </span>
          </li>
          <li className='flex flex-row gap-4 items-center text-sm'>
            <b className='min-w-40'>
              Select Multiple Items
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <Badge variant='secondary'>cntrl</Badge> + <IconMouseLeftClick className='w-8 h-8' />
            </span>
          </li>
          <li className='flex flex-row gap-4 items-center text-sm'>
            <b className='min-w-40'>
              Select Multiple Items
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <Badge variant='secondary'>hold</Badge>   <IconMouseLeftClick className='w-8 h-8' /> +  <Badge variant='secondary'>drag</Badge>
            </span>
          </li>
          <li className='flex flex-row gap-4 items-center text-sm'>
            <b className='min-w-40'>
              move items
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <ChevronLeftSquareIcon /> or <ChevronUpSquareIcon /> or <ChevronDownSquareIcon /> or  <ChevronLeftSquareIcon />
            </span>
          </li>
          <li className='flex flex-row gap-4 items-center text-sm'>
            <b className='min-w-40'>
              move items
            </b>
            :
            <span className='flex flex-row gap-2 items-center'>
              <Badge variant='secondary'>hold</Badge>   <IconMouseLeftClick className='w-8 h-8' /> +  <Badge variant='secondary'>drag</Badge>
            </span>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}
