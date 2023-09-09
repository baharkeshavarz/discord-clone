"use client";

import { Plus } from 'lucide-react';
import React from 'react'

const NavigationAction = () => {
  return (
    <div className="group">
        <button>
             <div className="flex justify-center w-[48px] h-[48px] rounded-[16px]
                            items-center bg-background dark:bg-neutral-700
                            group-hover:bg-emerald-500 
                            hover:bg-gray-500 transition"
                            >
                <Plus className="text-green-500 group-hover:text-white" />
            </div>
        </button>
    </div>
  )
}

export default NavigationAction