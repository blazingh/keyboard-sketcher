"use client"

import { useEditorStore } from './stores/editor-store';
import { BookTemplate, BoxSelect, Copy, DraftingCompass, FlipHorizontal, FlipVertical, Mouse, MousePointer, Move, PlusIcon, Redo2, Ruler, Trash2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Divider } from "@nextui-org/react";

export default function EditorToolbar() {
  const store = useEditorStore()
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
          onPress={() => store.setPointerAction("normal")}
        >
          <MousePointer className={cn(store.pointerAction === "normal" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setPointerAction("selectionBox")}
        >
          <BoxSelect className={cn(store.pointerAction === "selectionBox" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setPointerAction("ruler")}
        >
          <Ruler className={cn(store.pointerAction === "ruler" && "text-primary", "w-5 h-5")} />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant={"light"}
              isIconOnly
              size='sm'
            >
              <PlusIcon className={cn(store.pointerAction === "addition" && "bg-accent text-primary", "w-6 h-6")} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions" disabledKeys={["controller"]}>
            <DropdownItem
              key="switch"
              onPress={() => {
                store.setPointerAction("addition")
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
          onPress={() => store.setSelectionAction("move")}
        >
          <Move className={cn(store.selectionAction === "move" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setSelectionAction("duplicate")}
        >
          <Copy className={cn(store.selectionAction === "duplicate" && "text-primary", "w-5 h-5")} />
        </Button>

        <Button
          variant={"light"}
          isIconOnly
          size='sm'
          onPress={() => store.setSelectionAction("arc")}
        >
          <DraftingCompass className={cn(store.selectionAction === "arc" && "text-primary", "w-5 h-5")} />
        </Button>

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
