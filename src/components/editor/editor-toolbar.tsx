"use client"

import { cn } from '@/lib/utils';
import { Button } from "@nextui-org/react";
import { PointerAcitonStore } from './stores/pointer-actions-store';
import { pointerActionsOptions } from './constants/actions';
import { Cable } from 'lucide-react';

export default function EditorToolbar() {

  const pointerAction = PointerAcitonStore()

  return (
    <div className='absolute w-full p-2 z-20 flex items-center justify-center gap-2 pointer-events-none'>
      <div className={cn(
        'bg-default p-1 flex items-center justify-center rounded-xl *:pointer-events-auto',
      )}
      >

        {/*
        <span className='font-draft text-2xl hidden lg:block'>
          SKETCHER
        </span>

        <span className='font-draft text-2xl ml-1'>
          K
        </span>

        <Divider orientation='vertical' className='h-6 mx-2' />
        */}


        {pointerActionsOptions.map((action) => (
          <Button
            key={action.value}
            variant={pointerAction.selectedMode === action.value ? "flat" : "light"}
            color={pointerAction.selectedMode === action.value ? "primary" : "default"}
            isIconOnly
            size='sm'
            onPress={() => pointerAction.setSelectedMode(action.value)}
          >
            {action.icon}
          </Button>
        ))}

        <Button
          variant={"light"}
          color={"default"}
          isIconOnly
          size='sm'
          className='opacity-25'
          disabled
        >
          <Cable className='w-5 h-5' />
        </Button>

      </div>
    </div >
  )
}
