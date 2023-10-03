"use client";

import { ServerWithMembersWithProfiles } from '@/types'
import { ChannelType, MemberRole } from '@prisma/client'
import React from 'react'
import { ActionTooltip } from "@/components/action-tooltip";
import { Plus, Settings } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store';

interface ServerSectionProps {
    label: string,
    sectionType: "channels" | "members",
    role?: MemberRole,
    channelType?: ChannelType,
    server?: ServerWithMembersWithProfiles,
}

const ServerSection = ({ 
    label,
    sectionType,
    role,
    channelType,
    server
}: ServerSectionProps) => {
  const { onOpen} = useModal();   
  return (
    <div className="flex justify-between items-center py-2">
       <p className="text-xs uppercase">{label}</p>
       {role !== MemberRole.GUEST && sectionType === "channels" &&
         <ActionTooltip label="Create Channel" side="top">
            <button
              onClick={() => onOpen("createChannel", { channelType })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
               <Plus className="w-4 h-4 cursor-pointer"/>
            </button>
         </ActionTooltip>
       }

       {role === MemberRole.ADMIN && sectionType === "members" &&
         <ActionTooltip label="Manage Members" side="top">
            <button
              onClick={() => onOpen("members", { server })}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            >
               <Settings className="w-4 h-4 cursor-pointer"/>
            </button>
         </ActionTooltip>
       }
    </div>
  )
}

export default ServerSection