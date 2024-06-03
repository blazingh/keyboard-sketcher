"use client"

import { useEditorStore } from './stores/editor-store';
import { BoxSelect, Copy, DraftingCompass, FlipHorizontal, FlipVertical, Move, PlusIcon, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Divider } from "@nextui-org/react";

export default function EditorToolbar() {
  const store = useEditorStore()
  const { undo, redo, pastStates, futureStates } = useEditorStore.temporal.getState();
  return (
    <div className='absolute w-full p-2 z-20 flex items-center justify-center gap-4 pointer-events-none'>
      <div className={cn(
        'shadow bg-default border px-3 py-1 flex items-center justify-center rounded-xl *:pointer-events-auto',
      )}
      >

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
          isIconOnly
          size='sm'
          onClick={() => {
            store.clearActiveNodes()
            store.clearRulerNodes()
            undo()
          }}
          disabled={!pastStates.length}
        >
          <Undo2 className='w-5 h-5' />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onClick={() => redo()}
          disabled={!futureStates.length}
        >
          <Redo2 className='w-5 h-5' />
        </Button>

        <Divider orientation='vertical' className='h-5 mx-2' />

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setEditorMode("normal")}
        >
          <Move className={cn(store.editorMode === "normal" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setEditorMode("copy")}
        >
          <Copy className={cn(store.editorMode === "copy" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setEditorMode("arc")}
        >
          <DraftingCompass className={cn(store.editorMode === "arc" && "text-primary", "w-5 h-5")} />
        </Button>

        <Divider orientation='vertical' className='h-5 mx-2' />

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setEditorMode("select")}
        >
          <BoxSelect className={cn(store.editorMode === "select" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setEditorMode("ruler")}
        >
          <Ruler className={cn(store.editorMode === "ruler" && "text-primary", "w-5 h-5")} />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={"light"}
              isIconOnly
              size='sm'
            >
              <PlusIcon className={cn(store.editorMode === "addition" && "bg-accent text-primary", "w-6 h-6")} />
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


        <Divider orientation='vertical' className='h-5 mx-2' />

        <Button
          isDisabled={store.activeNodes.length === 0}
          variant={"light"}
          isIconOnly
          size='sm'
          onClick={() => store.flipActiveNodesHorizontally()}
          disabled={!store.activeNodes.length}
        >
          <FlipHorizontal className='w-5 h-5' />
        </Button>

        <Button
          isDisabled={store.activeNodes.length === 0}
          variant={"light"}
          isIconOnly
          size='sm'
          onClick={() => store.flipActiveNodesVertically()}
          disabled={!store.activeNodes.length}
        >
          <FlipVertical className='w-5 h-5' />
        </Button>

        <Button
          isDisabled={store.activeNodes.length === 0}
          variant={"light"}
          isIconOnly
          size='sm'
          onClick={() => store.deleteActiveNodes()}
          disabled={!store.activeNodes.length}
        >
          <Trash2 className=' text-red-500 w-5 h-5 ' />
        </Button>

      </div>
    </div >
  )
}
