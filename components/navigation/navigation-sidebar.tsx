import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import NavigationAction from './navigation-action';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';
import { NavigationItem } from './navigation-item';

export const NavigationSidebar = async () => {
  const profile = await currentProfile();  
  if ( !profile ) redirect("/")

  const servers = await db.server.findMany({
    where: {
        members: {
            some: {
                profileId: profile.id
            }
        }
    }
  })

   return (
    <div className="flex flex-col items-center text-primary w-full h-full dark:bg-[#1E1E22] py-3 space-y-4 " >
        <NavigationAction />
        <Separator className="w-10 h-[2px] bg-zinc-300 dark:bg-zinc-700 mx-auto rounded-md"/>
        <ScrollArea>
           {servers.map(server => (
               <div key={server.id} className="mb-3 py-1">
                   <NavigationItem
                      id= {server.id}
                      name= {server.name}
                      imageUrl= {server.imageUrl}
                    />
                </div>
           ) )}
        </ScrollArea>

        <div className="flex flex-col gap-y-5 text-center">
          <ModeToggle/>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
               elements: {
                  avatarBox: "h-[48px] w-[48px]"
               }
            }}
          />
        </div>
    </div>
  )
}
