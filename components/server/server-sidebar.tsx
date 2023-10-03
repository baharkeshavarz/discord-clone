import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { ServerHeader } from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import { ServerSearch } from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  }

const roleIconMap = {
    [MemberRole.GUEST]: "",
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}  

export const ServerSidebar = async ( { serverId } : ServerSidebarProps) => {
  const profile = await currentProfile();    
  if (!profile) {
      return redirectToSignIn();
    }   

  const server = await db.server.findUnique({
     where: {
        id: parseInt(serverId),
     },
     include: {
        channels: {
            orderBy: {
                createdAt: "asc"
            }
        },
        members: {
            include: {
                profile: true,
            },
            orderBy: {
                role: "asc"
            }
        }
     }
  })  

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter(member => member.id !== profile.id)
  if (!server) {
    return redirect("/");
  }

  const role = server.members.find(member => member.profileId === profile.id)?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
          <ServerHeader
              server={server}
              role={role}
          />
          <ScrollArea className="px-3">
             <div>
                <ServerSearch data={[
                       { 
                         label: "Text Channels",
                         type: "channel",
                         data: textChannels?.map(channel => ({
                            icon: iconMap[channel.type],
                            name: channel.name,
                            id: channel.id.toString(),
                         }))
                       },
                       { 
                        label: "Voice Channels",
                        type: "channel",
                        data: audioChannels?.map(channel => ({
                           icon: iconMap[channel.type],
                           name: channel.name,
                           id: channel.id.toString(),
                        }))
                      },
                      { 
                        label: "Video Channels",
                        type: "channel",
                        data: videoChannels?.map(channel => ({
                           icon: iconMap[channel.type],
                           name: channel.name,
                           id: channel.id.toString(),
                        }))
                      },
                      { 
                        label: "Members",
                        type: "member",
                        data: members?.map(member => ({
                           icon: roleIconMap[member.role],
                           name: member.profile.name,
                           id: member.id.toString(),
                        }))
                      }
                ]}/>
             </div>
          </ScrollArea>
     </div>
  )
}
