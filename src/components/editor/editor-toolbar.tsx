"use client"

import { cn } from '@/lib/utils';
import { Button } from "@nextui-org/react";
import { PointerAcitonStore } from './stores/pointer-actions-store';
import { pointerActionsOptions } from './constants/actions';

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
            variant={pointerAction.selectedMode === action.value ? "bordered" : "light"}
            color={pointerAction.selectedMode === action.value ? "primary" : "default"}
            isIconOnly
            size='sm'
            onPress={() => pointerAction.setSelectedMode(action.value)}
          >
            {action.icon}
          </Button>
        ))}

      </div>
    </div >
  )
}
