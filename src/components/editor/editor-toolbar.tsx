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
        'bg-default border px-1 py-1 items-center justify-center rounded-xl *:pointer-events-auto flex sm:hidden',
      )}
      >
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              size='sm'
              isIconOnly
            >
              <BookTemplate />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">
              New file
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className={cn(
        'bg-default border px-1 py-1 items-center justify-center rounded-xl *:pointer-events-auto hidden sm:flex',
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
          onPress={() => pointerAction.setSelectedMode("normal")}
        >
          <MousePointer className={cn(pointerAction.selectedMode === "normal" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => pointerAction.setSelectedMode("selectionBox")}
        >
          <BoxSelect className={cn(pointerAction.selectedMode === "selectionBox" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => pointerAction.setSelectedMode("ruler")}
        >
          <Ruler className={cn(pointerAction.selectedMode === "ruler" && "text-primary", "w-5 h-5")} />
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

        <Divider orientation='vertical' className='h-5 mx-2' />

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => selectionAction.setSelectedMode("move")}
        >
          <Move className={cn(selectionAction.selectedMode === "move" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => selectionAction.setSelectedMode("copy")}
        >
          <Copy className={cn(selectionAction.selectedMode === "copy" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => selectionAction.setSelectedMode("arc")}
        >
          <DraftingCompass className={cn(selectionAction.selectedMode === "arc" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          isDisabled={store.activeNodes.length === 0}
          variant={"light"}
          isIconOnly
          size='sm'
          onClick={() => selectionAction.handleMirrorHor()}
          disabled={!store.activeNodes.length}
        >
          <FlipHorizontal className='w-5 h-5' />
        </Button>

        <Button
          isDisabled={store.activeNodes.length === 0}
          variant={"light"}
          isIconOnly
          size='sm'
          onClick={() => selectionAction.handleMirrorVer()}
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
