"use client"
import { cn } from "@/lib/utils";
import { NodeProps } from "reactflow";

export default function Switch(props: NodeProps) {
  return (
    <div
      className={cn(
        'w-[140px] h-[140px] border-2 border-foreground rounded-md bg-secondary relative',
        props.selected && 'border-primary',
        props.data.overlaped && 'bg-destructive',
        props.data.overlaped && props.selected && 'border-destructive-foreground',
      )}
      style={{
        transform: `rotate(${props.data.rotation}deg)`,
        zIndex: 2
      }}
    >
    </div>
  );
}
