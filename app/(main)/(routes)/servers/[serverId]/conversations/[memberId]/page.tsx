import ChatHeader from '@/components/chat/chat-header';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

interface MemberIdPageProps {
  params: {
    memberId: string,
    serverId: string,
  }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  // Find the member that logged in
  const currentMember = await db.member.findFirst({
    where: {
       serverId: parseInt(params.serverId),
       profileId: profile.id,
    },
    include: {
       profile: true,
    }
  });

  if (!currentMember) {
    return redirect("/")
  }

  // Find the conversation between loggedIn user and selected member
  const conversation = await getOrCreateConversation(currentMember.id.toString(), params.memberId)
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation;
  // Here we dont know which one is other person
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
       <ChatHeader
           type="conversation"
           serverId={params.serverId}
           name={otherMember.profile.name}
           imageUrl={otherMember.profile.imageUrl}
       />
    </div>
  )
}

export default MemberIdPage