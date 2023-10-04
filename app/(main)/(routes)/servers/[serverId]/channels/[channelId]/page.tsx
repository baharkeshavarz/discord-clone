import ChatHeader from '@/components/chat/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

interface ChannelIdPageProps {
  params: {
     serverId: string;
     channelId: string;
  }
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
     return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: parseInt(params.channelId),
    }
  });

 const member = await db.member.findFirst({
   where: {
     serverId: parseInt(params.serverId),
     profileId: profile.id
   }
 });

 if (!channel || !member) {
   redirect("/")
 }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
          type="channel"
          name={channel.name}
          serverId={channel.serverId.toString()}
      />
    </div>
  )
}

export default ChannelIdPage