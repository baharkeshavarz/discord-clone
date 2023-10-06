import { Member, Profile } from "@prisma/client";
import React from 'react'
import { UserAvatar } from "../user-avatar";

interface ChatItemProsp {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
      };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}: ChatItemProsp) => {
  return (
    <div className="group flex-1 flex items-center hover:bg-black/5 p-2">
        <div className="px-2">
           <UserAvatar src={member.profile.imageUrl} />
        </div>

        <div className="flex items-start gap-x-2 flex-col w-full">
            <div className="flex items-center">
                <p onClick={() => {}} className="font-semibold text-sm hover:underline cursor-pointer">
                   {member.profile.name}
                </p>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm"> 
                  {timestamp}
                </span> 
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 text-sm">
              {content}
            </div>
       </div>
     </div>
  )
}
