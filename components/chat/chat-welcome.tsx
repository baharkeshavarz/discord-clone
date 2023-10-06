import { Hash } from 'lucide-react';
import React from 'react'

interface ChatWelcomProps {
    type: "channel" | "conversation";
    name: string;
}

const ChatWelcom = ({
    type,
    name
}: ChatWelcomProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
        {type === "channel" && (
            <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700
                            flex justify-center items-center">
                <Hash className="h-12 w-12 text-white" />
            </div> 
         )}
         <p className="font-bold md:text-3xl text-xl">
           {type === "channel" ? "Welcome to #" : ""} {name}
         </p>
         <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {type === "channel"
              ? `This is the start of the #${name} channel.`
              : `This is the start of your conversation.`
            }
         </p>
    </div>
  )
}

export default ChatWelcom;