import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import ThreeDModelGenerator from "../genarators/3d-model-generator"


export default function ThreeDModelGeneratorDialog({ children, ...props }: DialogProps & { children?: any }) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[90svw]">

        <ThreeDModelGenerator />

      </DialogContent>
    </Dialog>
  )
}
