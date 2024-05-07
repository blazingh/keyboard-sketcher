import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import ThreeDModelGenerator from "../genarators/3d-model-generator"
import { X } from "lucide-react"


export default function ThreeDModelGeneratorDialog({ children, ...props }: DialogProps & { children?: any }) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95svw] w-full">
        <DialogClose className="absolute top-0.5 right-0.5 z-20">
          <X />
        </DialogClose>

        <ThreeDModelGenerator />

      </DialogContent>
    </Dialog>
  )
}
