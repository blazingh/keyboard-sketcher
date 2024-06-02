"use client"

import { useEditorStore } from './stores/editor-store';
import { BoxSelect, Copy, DraftingCompass, FlipHorizontal, FlipVertical, Move, PlusIcon, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Divider } from "@nextui-org/react";
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
            isIconOnly
            onClick={() => {
              store.clearActiveNodes()
              store.clearRulerNodes()
              undo()
            }}
            disabled={!pastStates.length}
          >
            <Undo2 />
          </Button>

          <Button
            variant={"light"}
            isIconOnly
            onClick={() => redo()}
            disabled={!futureStates.length}
          >
            <Redo2 />
          </Button>

          <Divider orientation='vertical' className='h-8' />

          <Button
            variant={"light"}
            isIconOnly
            onPress={() => store.setEditorMode("normal")}
          >
            <Move className={cn(store.editorMode === "normal" && "text-primary")} />
          </Button>

          <Button
            variant={"light"}
            isIconOnly
            onPress={() => store.setEditorMode("copy")}
          >
            <Copy className={cn(store.editorMode === "copy" && "text-primary")} />
          </Button>

          <Button
            variant={"light"}
            isIconOnly
            onPress={() => store.setEditorMode("arc")}
          >
            <DraftingCompass className={cn(store.editorMode === "arc" && "text-primary")} />
          </Button>

          <Divider orientation='vertical' className='h-8' />

          <Button
            variant={"light"}
            isIconOnly
            onPress={() => store.setEditorMode("select")}
          >
            <BoxSelect className={cn(store.editorMode === "select" && "text-primary")} />
          </Button>

          <Button
            variant={"light"}
            isIconOnly
            onPress={() => store.setEditorMode("ruler")}
          >
            <Ruler className={cn(store.editorMode === "ruler" && "text-primary")} />
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant={"light"}
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
            isIconOnly
            onClick={() => store.flipActiveNodesHorizontally()}
            disabled={!store.activeNodes.length}
          >
            <FlipHorizontal />
          </Button>

          <Button
            variant={"light"}
            isIconOnly
            onClick={() => store.flipActiveNodesVertically()}
            disabled={!store.activeNodes.length}
          >
            <FlipVertical />
          </Button>

          <Button
            variant={"light"}
            isIconOnly
            onClick={() => store.deleteActiveNodes()}
            disabled={!store.activeNodes.length}
          >
            <Trash2 className=' text-red-500 ' />
          </Button>

        </div>
      </div>
    </div >
  )
}
