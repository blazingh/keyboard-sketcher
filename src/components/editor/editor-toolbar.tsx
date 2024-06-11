"use client"

import { useEditorStore } from './stores/editor-store';
import { BookTemplate, BoxSelect, Copy, DraftingCompass, FlipHorizontal, FlipVertical, Mouse, MousePointer, Move, PlusIcon, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Divider } from "@nextui-org/react";
import { SelectionAcitonStore } from './stores/selection-actions-store';
import { PointerAcitonStore } from './stores/pointer-actions-store';

export default function EditorToolbar() {
  const store = useEditorStore()
  const selectionAction = SelectionAcitonStore()
  const pointerAction = PointerAcitonStore()

  return (
    <div className='absolute w-full p-2 z-20 flex items-center justify-center gap-2 pointer-events-none'>
      <div className={cn(
        'bg-default p-1 items-center justify-center rounded-xl *:pointer-events-auto',
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
          variant={pointerAction.selectedMode === "normal" ? "bordered" : "light"}
          color={pointerAction.selectedMode === "normal" ? "primary" : "default"}
          isIconOnly
          size='sm'
          onPress={() => pointerAction.setSelectedMode("normal")}
        >
          <MousePointer className={cn("w-5 h-5")} />
        </Button>

        <Button
          variant={pointerAction.selectedMode === "selectionBox" ? "bordered" : "light"}
          color={pointerAction.selectedMode === "selectionBox" ? "primary" : "default"}
          isIconOnly
          size='sm'
          onPress={() => pointerAction.setSelectedMode("selectionBox")}
        >
          <BoxSelect className={cn("w-5 h-5")} />
        </Button>

        <Button
          variant={pointerAction.selectedMode === "ruler" ? "bordered" : "light"}
          color={pointerAction.selectedMode === "ruler" ? "primary" : "default"}
          isIconOnly
          size='sm'
          onPress={() => pointerAction.setSelectedMode("ruler")}
        >
          <Ruler className={cn("w-5 h-5")} />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={"light"}
              isIconOnly
              size='sm'
            >
              <PlusIcon className={cn(pointerAction.selectedMode === "addition" && "bg-accent text-primary", "w-6 h-6")} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" disabledKeys={["controller"]}>
            <DropdownItem
              key="switch"
              onPress={() => {
                pointerAction.setSelectedMode("addition")
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
    </div >
  )
}
