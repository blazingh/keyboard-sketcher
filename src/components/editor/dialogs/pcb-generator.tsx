import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogProps } from "@radix-ui/react-alert-dialog"
import PCBModelGenerator from "../genarators/pcb-generator"


export default function PCBGeneratorDialog({ children, ...props }: DialogProps & { children?: any }) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>

        <PCBModelGenerator />

      </DialogContent>
    </Dialog>
  )
}
