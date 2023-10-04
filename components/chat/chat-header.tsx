import { Hash, Menu } from 'lucide-react'
import React from 'react'
import MobileToggle from '../mobile-toggle'

interface ChatHeaderProps {
    serverId: string,
    name: string,
    type: "channel" | "conversation",
    imageUrl?: string,
}

const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center h-12 border-b-2 border-neutral-200 dark:border-neutral-800 text-md font-semibold px-3">
        <MobileToggle serverId={serverId}/>
        { type === "channel" && (
             <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
        )}
        <p className="font-semibold text-md text-black dark:text-white">
          {name}
        </p>
    </div>
  )
}

export default ChatHeader