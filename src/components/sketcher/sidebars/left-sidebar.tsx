import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { workSpaceOptionsContext } from "@/contexts/workspace"
import { cn } from "@/lib/utils"
import { Settings2 } from "lucide-react"
import { useContext, useState } from "react"

export default function LeftSidebar() {

  const wsc = useContext(workSpaceOptionsContext)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className={cn(
      "flex flex-col p-4 gap-4",
      "fixed h-svh z-30 top-0 left-0 bg-background rounded-r-2xl transition-all border-r-2 border-primary ease-in-out w-[280px]",
      settingsOpen ? "shadow-xl" : "-translate-x-[280px] shadow-none"
    )}
    >
      <Button
        onClick={() => setSettingsOpen(p => !p)}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 right-0 transition-all ease-in-out py-6',
          settingsOpen ? "translate-x-1/2 px-1.5" : "translate-x-full rounded-l-none"
        )}
      >
        <Settings2 className='w-5 h-5' />
      </Button>

      {/* content starts here */}

      {/* performence section*/}
      <div className="flex flex-col gap-2">
        <span className="w-full border-b border-primary mb-2 text-lg font-medium">
          Performance
        </span>

        <div className="flex items-center space-x-2">
          <Label htmlFor="render-outline">
            Render case outline
          </Label>
          <Switch id="render-outline" checked={wsc?.options.renderOuline} onCheckedChange={(v) => wsc?.updateOption('renderOuline', v)} />
        </div>

      </div>

    </div>
  )
}
