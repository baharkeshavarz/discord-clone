import { ServerSidebar } from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const ServerIdLayout = async ({ 
         children,
         params
    }: { 
        children:  React.ReactNode,
        params: { serverId: string }
    }) => {

  const profile = await currentProfile();    
  if (!profile) {
    return redirectToSignIn();
  }   

 const server = await db.server.findUnique({
    where: {
        id: parseInt(params.serverId),
        members: {
            some: {
                profileId: profile.id,
            }
        }
    }
 });

  if (!server) {
    return redirect("/")
  }

  return (
    <div className="h-full">
          <div className="hidden md:flex h-full w-60 inset-y-0 flex-col fixed">
             <ServerSidebar serverId={server.id.toString()} />
          </div>
          <main className="h-full md:ml-60 bg-orange-950">
             {children}
          </main>
         
    </div>
  )
}

export default ServerIdLayout;
