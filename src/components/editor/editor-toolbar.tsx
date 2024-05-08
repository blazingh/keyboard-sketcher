"use client"

import { baseNodeState, useEditorStore } from './stores/editor-store';
import { Button } from '@/components/ui/button';
import { Copy, PlusIcon, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
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

        <Button variant={"ghost"} onClick={() => undo()} disabled={!pastStates.length}>
          <Undo2 className='shrink-0' />
        </Button>

        <Button variant={"ghost"} onClick={() => redo()} disabled={!futureStates.length}>
          <Redo2 className='shrink-0' />
        </Button>

        <Separator orientation='vertical' className='h-6 mx-2' />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"}>
              <PlusIcon className='shrink-0' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                store.activateNodeForAddition(baseNodeState, null)
              }}
            >
              switch
            </DropdownMenuItem>
            <DropdownMenuItem disabled>constroller</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Toggle variant={"default"} pressed={store.rulerActive} onPressedChange={(state) => { store.setRulerState(state) }} >
          <Ruler className='shrink-0' />
        </Toggle>

      </div>
      <div className='flex items-center [&>button]:w-10 [&>button]:h-10'>

        <Button variant={"ghost"} disabled={!store.activeNodes.length}>
          <Copy className='shrink-0 cursor-copy' />
        </Button>

        <Button variant={"ghost"} onClick={() => store.deleteActiveNodes()} disabled={!store.activeNodes.length}>
          <Trash2 className='shrink-0 text-red-500 ' />
        </Button>

      </div>
    </div>
  )
}
