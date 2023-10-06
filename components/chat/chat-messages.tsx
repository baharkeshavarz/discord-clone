"use client"

import { Member } from '@prisma/client';
import React, { Fragment } from 'react'
import ChatWelcom from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import { MessageWithMemberWithProfile } from '@/types';
import { ChatItem } from './chat-item';
import { format } from "date-fns";

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
    socketQuery,
    type
}: ChatMessagesProps) => {

  const DATE_FORMAT = "d MMM yyyy, HH:SS"
  const queryKey = `chat:${chatId}`;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
  });

  if (status === "loading") {
    return <div className="flex-1 flex justify-center items-center flex-col">
        <Loader2 className="h-7 w-7 text-zinc-500 dark:text-zinc-400 animate-spin"/>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Loading classes...
        </p>
    </div>
  }

  if (status === "error") {
    return <div className="flex-1 flex justify-center items-center flex-col">
        <ServerCrash className="h-7 w-7 text-zinc-500 dark:text-zinc-400"/>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Something went wrong!
        </p>
    </div>
  }
 console.log(data?.pages);
  return (
    <div className="flex-1 flex flex-col py-6 overflow-y-auto">
       <div className="flex-1"/>
        <ChatWelcom
              type={type}
              name={name}
          />
        {data?.pages.map((group, i) => (
           <Fragment key={i}>
               {group.items.map((message: MessageWithMemberWithProfile) => (
                 <div key={message.id} className="flex-1">
                    <ChatItem
                      key={message.id}
                      id={message.id.toString()}
                      content={message.content}
                      member={message.member}
                      timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                      fileUrl={message.fileUrl}
                      deleted={message.deleted}
                      currentMember={member}
                      isUpdated={message.createdAt !== message.updatedAt}
                      socketUrl={socketUrl}
                      socketQuery={socketQuery}
                    />
                 </div>
               ))}
           </Fragment>
        ))}
    </div>
  )
}
