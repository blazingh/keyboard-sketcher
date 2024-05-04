"use client"

import { baseNodeState, useEditorStore } from './editor-store';
import { Button } from '@/components/ui/button';
import { PlusIcon, Redo2, Trash, Trash2, Undo2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function EditorToolbar() {
  const store = useEditorStore()
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  return (
    <div className={cn(
      'absolute w-full shadow bg-background border-b border-primary z-20 px-2 flex items-center justify-between rounded-lg',
    )}
    >
      <div className='flex items-center [&>button]:w-10 [&>button]:h-10'>
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
            <DropdownMenuItem>constroller</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='flex items-center [&>button]:w-10 [&>button]:h-10'>
        <Button variant={"ghost"} onClick={() => store.deleteActiveNodes()} disabled={!store.activeNodes.length}>
          <Trash2 className='shrink-0 text-red-500' />
        </Button>
      </div>
    </div>
  )
}
