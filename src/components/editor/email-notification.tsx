import { Button, Input } from "@nextui-org/react";
import { Construction, SendHorizonal } from "lucide-react";

export default function EmailNotification({ featureName }: { featureName: string }) {
  return (
    <div className="flex flex-col justify-center items-center p-8 gap-6 text-center">

      <Construction className="w-20 h-20 animate-pulse text-yellow-500" />

      <span>
        This feature in currently under developement 🥺
      </span>

      <span >
        You can provide your email address to get notified when this feature is available.
      </span>

      <Input
        label="Email address"
      />

      <div>
        <Button
          fullWidth
          color="primary"
          endContent={<SendHorizonal />}
        >
          Email Me Updates
        </Button>
        <span className="text-xs">
          (no spam, no ads, no 💩 . just notification for this feature)
        </span>
      </div>

    </div>
  )
}
