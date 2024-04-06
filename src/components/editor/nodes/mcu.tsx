"use client"
import { cn } from "@/lib/utils";
import { NodeProps } from "reactflow";

export function Mcu(props: NodeProps) {
  return (
    <div
      className={cn(
        'w-[140px] h-[140px] border-2 border-foreground rounded-md bg-green-500 relative opacity-50',
        props.selected && 'border-primary',
        props.data.overlaped && 'bg-destructive',
        props.data.overlaped && props.selected && 'border-destructive-foreground',
      )}
      style={{
        transform: `rotate(${props.data.rotation}deg)`,
        width: `${props.data.width || 140}px`,
        height: `${props.data.height || 280}px`,
        zIndex: 1
      }}
    >
      <div className="bg-green-700 w-[90px] h-[30px] rounded-b absolute top-0 left-1/2 -translate-x-1/2" />
    </div>
  );
}
