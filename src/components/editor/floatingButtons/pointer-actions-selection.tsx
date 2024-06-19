"use client"

import { cn } from '@/lib/utils';
import { Button, Divider } from "@nextui-org/react";
import { Cable } from 'lucide-react';
import { PointerAcitonStore } from '../stores/pointer-actions-store';
import { pointerActionsOptions } from '../constants/actions';
import { useEditorStore } from '../stores/editor-store';

export default function PointerActionsToolbar() {

  const pointerAction = PointerAcitonStore()
  const { activeNodes, deleteActiveNodes, flipActiveNodesVertically, flipActiveNodesHorizontally } = useEditorStore()

  return (
    <div className={cn(
      'bg-default p-1 flex items-center justify-center rounded-xl',
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

      {[[0, 3], [3, 6]].map((indexes) => (
        <>
          {pointerActionsOptions.slice(indexes[0], indexes[1]).map((action) => (
            (
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
            )
          ))}
          <Divider orientation='vertical' className='h-6 mx-2' />
        </>
      ))}

      {pointerActionsOptions.slice(6, 9).map((action) => (
        (
          <Button
            key={action.value}
            variant={"light"}
            color={"default"}
            isIconOnly
            size='sm'
            onPress={() => {
              switch (action.value) {
                case "flipH":
                  flipActiveNodesHorizontally()
                  break;
                case "flipV":
                  flipActiveNodesVertically()
                  break;
                case "delete":
                  deleteActiveNodes()
                  break;
              }
            }}
            isDisabled={activeNodes.length === 0}
          >
            {action.icon}
          </Button>
        )
      ))}

    </div>
  )
}
