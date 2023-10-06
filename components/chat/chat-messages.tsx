import { Member } from '@prisma/client';
import React from 'react'
import ChatWelcom from './chat-welcome';

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;      // load data from this url
    socketUrl: string,   // send data to this url
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string;
    type: "channel" | "conversation";
}

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    paramKey,
    paramValue,
    type
}: ChatMessagesProps) => {
  return (
    <div className="flex-1 flex flex-col py-6 overflow-y-auto">
       <div className="flex-1"/>
       <ChatWelcom
            type={type}
            name={name}
         />
    </div>
  )
}
