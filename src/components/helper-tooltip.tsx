import { HelpCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";

export function HelperTooltip({ desc }: { desc: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HelpCircle className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-2 max-w-[200px]">
        <span className="text-xs">
          {desc}
        </span>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
