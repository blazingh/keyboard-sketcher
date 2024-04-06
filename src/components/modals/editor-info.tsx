import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, ButtonProps } from "@/components/ui/button"
import { ChevronDownSquareIcon, ChevronLeftSquareIcon, ChevronUpSquareIcon, InfoIcon } from "lucide-react"
import IconMouseMiddleClick from "@/icons/mouse-middle-click"
import { Badge } from "../ui/badge"
import IconMouseLeftClick from "@/icons/mouse-left-click"
import IconMouseRightclick from "@/icons/mouse-right-click"
import IconMouseScrollWheel from "@/icons/mouse-scroll-wheel"
import { Separator } from "../ui/separator"

export default function EditorDialogTrigger(props: ButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
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
              <IconMouseMiddleClick className='w-8 h-8' /> or <IconMouseLeftClick className='w-8 h-8' />
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
              <span className="font-medium">hold</span>
              <Badge variant='secondary'>Ctrl</Badge>
              + <IconMouseLeftClick className='w-8 h-8' />
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
        <Separator />
        <div>
          <p className="my-4 font-medium w-ful text-center">
            have something to say ?
          </p>
          <div className="flex items-center justify-around">
            <span>
              <a href="mailto:the.one.and.only@hadibaalbaki.com" target="_blank" className="underline text-primary">Email</a>
            </span>
            <span>
              <a href="https://www.instagram.com/hady_baal/" target="_blank" className="underline text-primary">Instagram</a>
            </span>
            <span>
              <a href="discordapp.com/users/hadibaal" target="_blank" className="underline text-primary">Discord</a>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
