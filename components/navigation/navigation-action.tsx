"use client";

import { Plus } from 'lucide-react';
import React from 'react'
import { ActionTooltip } from '../action-tooltip';
import { useModal } from '@/hooks/useModalStrore';

const NavigationAction = () => {
  const { onOpen} = useModal();
  return (
    <ActionTooltip
         label="Add a server"
         align="center"
         side="right"
         >
        <button 
              onClick={() => onOpen("createServer")}
              className="group flex justify-center"
              >
                 <div className="flex justify-center w-[48px] h-[48px] rounded-[16px]
                             items-center bg-background dark:bg-neutral-700
                            group-hover:bg-emerald-500 
                             transition"
                            >
                  <Plus className="text-green-500 group-hover:text-white"/>
            </div>
        </button>
    </ActionTooltip>
  )
}

export default NavigationAction