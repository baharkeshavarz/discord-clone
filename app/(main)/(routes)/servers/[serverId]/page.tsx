import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
// in this page we redirect to "general" channel of each server immediately

interface ServerIdPageProps {
    params : {
      serverId: string,
   }
}

const ServerPage = async ({ params }: ServerIdPageProps) => {
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
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  const initialChannel = server?.channels[0];
  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${server?.id}/channels/${initialChannel.id}`)
}

export default ServerPage;
