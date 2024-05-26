"use client"

import { useEditorStore } from './stores/editor-store';
import { Button } from '@/components/ui/button';
import { BoxSelect, Copy, FlipHorizontal, FlipVertical, Hand, MousePointer2, Move, PlusIcon, Rainbow, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toggle } from '../ui/toggle';

export default function EditorToolbar() {
  const store = useEditorStore()
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  return (
    <div className={cn(
      'absolute w-full shadow bg-background border-b border-primary z-20 px-2 flex items-center justify-between rounded-lg',
    )}
    >
      <div className='flex items-center [&>button]:w-10 [&>button]:h-10'>

        <span className='font-draft text-2xl hidden lg:block'>
          SKETCHER
        </span>
        <span className='font-draft text-2xl lg:hidden '>
          K
        </span>

        <Separator orientation='vertical' className='h-6 mx-2' />

        <Button variant={"ghost"} onClick={() => {
          store.clearActiveNodes()
          store.clearRulerNodes()
          undo()
        }}
          disabled={!pastStates.length}>
          <Undo2 className='shrink-0' />
        </Button>

        <Button variant={"ghost"} onClick={() => redo()} disabled={!futureStates.length}>
          <Redo2 className='shrink-0' />
        </Button>

        <Separator orientation='vertical' className='h-6 mx-2' />

        <Toggle variant={"default"} pressed={store.editorMode === "normal"} onPressedChange={(state) => state && store.setEditorMode("normal")} >
          <Move className='shrink-0' />
        </Toggle>

        <Toggle variant={"default"} pressed={store.editorMode === "copy"} onPressedChange={(state) => state && store.setEditorMode("copy")} >
          <Copy className='shrink-0' />
        </Toggle>

        <Toggle variant={"default"} pressed={store.editorMode === "arc"} onPressedChange={(state) => state && store.setEditorMode("arc")} >
          <Rainbow className='shrink-0 rotate-45' />
        </Toggle>

        <Separator orientation='vertical' className='h-6 mx-2' />


        <Toggle variant={"default"} pressed={store.editorMode === "select"} onPressedChange={(state) => state && store.setEditorMode("select")} >
          <BoxSelect className='shrink-0' />
        </Toggle>

        <Toggle variant={"default"} pressed={store.editorMode === "ruler"} onPressedChange={(state) => state && store.setEditorMode("ruler")} >
          <Ruler className='shrink-0' />
        </Toggle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className={cn(store.editorMode === "addition" && "bg-accent text-primary")}>
              <PlusIcon className='shrink-0' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                store.setEditorMode("addition")
              }}
            >
              switch
            </DropdownMenuItem>
            <DropdownMenuItem disabled>constroller</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <div className='flex items-center [&>button]:w-10 [&>button]:h-10'>

        <Button variant={"ghost"} onClick={() => store.flipActiveNodesHorizontally()} disabled={!store.activeNodes.length}>
          <FlipHorizontal className='shrink-0 cursor-copy' />
        </Button>

        <Button variant={"ghost"} onClick={() => store.flipActiveNodesVertically()} disabled={!store.activeNodes.length}>
          <FlipVertical className='shrink-0 cursor-copy' />
        </Button>

        <Button variant={"ghost"} onClick={() => store.deleteActiveNodes()} disabled={!store.activeNodes.length}>
          <Trash2 className='shrink-0 text-red-500 ' />
        </Button>

      </div>
    </div>
  )
}
