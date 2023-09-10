import { MemberRole, Server } from '@prisma/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';

interface ServerHeaderProps {
    server: Server;
    role?: string;
}
export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
           <button className="flex items-center justify-between w-full h-12 font-semibold text-md px-3 
                              border-b-2 border-neutral-200 dark:border-neutral-800
                            hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"> 
               {server.name}
              <ChevronDown className="w-5 h-5" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 font-medium text-xs">
            {isModerator && (
                 <DropdownMenuLabel className="flex justify-between items-center text-indigo-600 dark:text-indigo-400 px-3 cursor-pointer">
                    Invite People
                    <UserPlus className="h-4 w-4 ml-auto" />
                 </DropdownMenuLabel>
            )}
            {isAdmin && (
                <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                >
                    Server Settings
                    <Settings className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
           )}
           {isAdmin && (
                <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                >
                    Manage Members
                    <Users className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
           )}
          {isModerator && (
                <DropdownMenuItem
                    className="px-3 py-2 text-sm cursor-pointer"
                >
                    Create Channel
                    <PlusCircle className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
          )}
        {isModerator && (
          <DropdownMenuSeparator />
        )}
       
         {isAdmin && (
            <DropdownMenuItem
                className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
                Delete Server
                <Trash className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
      
         {!isAdmin && (
            <DropdownMenuItem
                className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            >
                Leave Server
                <LogOut className="h-4 w-4 ml-auto" />
            </DropdownMenuItem>
         )}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}