"use client";

import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '../ui/command';
import { CommandGroup, CommandItem } from 'cmdk';
import { useParams, useRouter } from 'next/navigation';

interface ServerSearchProps {
   data: {
     label: string,
     type: "channel" | "member",
     data: {
       icon: React.ReactNode,
       name: string,
       id: string,
     }[] | undefined;
   }[]
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
 
  // Manage the click on channels or members
  const onClick = ({ id, type }: {id: string, type: "channel" | "member"}) => {
     setOpen(false);
     if (type === "member") {
       return router.push(`/servers/${params.serverId}/conversations/${id}`)
     }

     if (type === "channel") {
      return router.push(`/servers/${params.serverId}/channels/${id}`)
     }
  }

  // Open the command by keyboard keys
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
         e.preventDefault();
         setOpen((open) => !open)
       }
     }
     document.addEventListener("keydown", down);
     return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
       onClick={() => setOpen(true)}
       className="group rounded-md w-full flex justify-start items-center mt-2 gap-x-1 p-2 transition hover:bg-zinc-700/10 dark:bg-zinc-700/50">
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
        <p className="text-zinc-500 dark:text-zinc-40 font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
            Search
        </p> 
        <kbd
          className="h-5 gap-1 rounded border px-1.5 font-mono text-[12px] font-medium text-gray-400 ml-auto flex items-center"
        >
          <span className="text-sm">⌘</span>K
        </kbd>
      </button>
       <CommandDialog open={open} onOpenChange={setOpen}>
           <CommandInput placeholder="Search all channels and members" />
           <CommandList>
             <CommandEmpty>
                No Results found
             </CommandEmpty>
             {data.map(({label, type, data}) => {
                if (!data?.length) return null;
                return (
                    <CommandGroup
                      key={label}
                      heading={label}
                    >
                     {data.map(( { id, icon, name }) => {
                        return (
                            <CommandItem
                                key={id}
                                onSelect={() => onClick({ id, type })}
                                className="flex items-center text-sm"
                              >
                                {icon}
                                <span>{name}</span>
                            </CommandItem>
                        );
                     })}
                    </CommandGroup>
                )
             })} 
           </CommandList>
         </CommandDialog>
    </>
  )
}
