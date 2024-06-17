import { addToMailNotification } from "@/actions/add-to-mail-notification";
import { cn } from "@/lib/utils";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { Construction, SendHorizonal } from "lucide-react";
import { useEffect } from "react";
import { useFormState } from "react-dom";

const initialState = {
  email: "",
  feature: "",
  success: "",
  message: ""
}

export default function EmailNotification({ featureName }: { featureName: string }) {

  const [state, formAction] = useFormState(addToMailNotification, initialState)

  useEffect(() => {
    if (state.success === true)
      return
  }, [state.success])

  return (
    <form action={formAction}>
      <input type="hidden" name="feature" value={featureName} />
      <div className="flex flex-col justify-center items-center p-8 gap-6 text-center">

        <Construction className="w-20 h-20 animate-pulse text-yellow-500" />

        <span>
          This feature in currently under developement 🥺
        </span>

        <span >
          You can provide your email address to get notified when this feature is available.
        </span>

        <Input
          name="email"
          label="Email address"
          isDisabled={state.success}
        />

        <span
          className={cn(
            "text-sm font-semibold",
            state.success ? "text-green-500" : "text-red-500"
          )}
        >
          {state.message}
        </span>

        <div>
          <Button
            isDisabled={state.success}
            type="submit"
            fullWidth
            color="primary"
            endContent={<SendHorizonal />}
            size="lg"
          >
            Email Me Updates
          </Button>
          <span className="text-xs">
            (no spam, no ads, no 💩 . just notification for this feature)
          </span>
        </div>

      </div>
    </form>
  )
}
