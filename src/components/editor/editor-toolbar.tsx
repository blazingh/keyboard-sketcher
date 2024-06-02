"use client"

import { useEditorStore } from './stores/editor-store';
import { BoxSelect, Copy, DraftingCompass, FlipHorizontal, FlipVertical, Move, PlusIcon, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { Toggle } from '../ui/toggle';

export default function EditorToolbar() {
  const store = useEditorStore()
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  return (
    <div className='absolute w-full p-2 z-20'>
      <div className={cn(
        'w-full shadow bg-accent border  px-2 flex items-center justify-between rounded-xl',
      )}
      >
        <div className='flex items-center gap-1 '>

          {/*
        <span className='font-draft text-2xl hidden lg:block'>
          SKETCHER
        </span>
        <span className='font-draft text-2xl lg:hidden '>
          K
        </span>

        <Separator orientation='vertical' className='h-6 mx-2' />
        */}

          <Button
            variant={"light"}
            size='sm'
            isIconOnly
            onClick={() => {
              store.clearActiveNodes()
              store.clearRulerNodes()
              undo()
            }}
            disabled={!pastStates.length}
          >
            <Undo2 className='shrink-0' />
          </Button>

          <Button
            variant={"light"}
            size='sm'
            isIconOnly
            onClick={() => redo()}
            disabled={!futureStates.length}
          >
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
            <DraftingCompass className='shrink-0' />
          </Toggle>

          <Separator orientation='vertical' className='h-6 mx-2' />

          <Toggle variant={"default"} pressed={store.editorMode === "select"} onPressedChange={(state) => state && store.setEditorMode("select")} >
            <BoxSelect className='shrink-0' />
          </Toggle>

          <Toggle variant={"default"} pressed={store.editorMode === "ruler"} onPressedChange={(state) => state && store.setEditorMode("ruler")} >
            <Ruler className='shrink-0' />
          </Toggle>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant={"light"}
                size='sm'
                isIconOnly
                className={cn(store.editorMode === "addition" && "bg-accent text-primary")}
              >
                <PlusIcon className='shrink-0' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" disabledKeys={["controller"]}>
              <DropdownItem
                key="switch"
                onPress={() => {
                  store.setEditorMode("addition")
                }}>
                switch
              </DropdownItem>
              <DropdownItem
                key="controller"
              >
                controller
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </div>
        <div className='flex items-center gap-2'>

          <Button
            variant={"light"}
            size='sm'
            isIconOnly
            onClick={() => store.flipActiveNodesHorizontally()}
            disabled={!store.activeNodes.length}
          >
            <FlipHorizontal className='shrink-0 cursor-copy' />
          </Button>

          <Button
            variant={"light"}
            size='sm'
            isIconOnly
            onClick={() => store.flipActiveNodesVertically()}
            disabled={!store.activeNodes.length}
          >
            <FlipVertical className='shrink-0 cursor-copy' />
          </Button>

          <Button
            variant={"light"}
            size='sm'
            isIconOnly
            onClick={() => store.deleteActiveNodes()}
            disabled={!store.activeNodes.length}
          >
            <Trash2 className='shrink-0 text-red-500 ' />
          </Button>

        </div>
      </div>
    </div >
  )
}
