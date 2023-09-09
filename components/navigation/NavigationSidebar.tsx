import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import NavigationAction from './NavigationAction';

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
    <div className="h-full flex-col items-center text-primary w-full dark:bg-[#1E1E22] py-3 space-y-4" >
        <NavigationAction />
    </div>
  )
}
