"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuSub,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
   DropdownMenuItem,
   DropdownMenuPortal, 
   DropdownMenuSubContent
  } from "../ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-5 ml-2 text-indigo-500"/>,
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"/>
}

export const MembersModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [ loadingId, setLoadingId ] = useState(0);
  const router = useRouter();

  const onKick = async (memberId: number) => {
    try {
      setLoadingId(memberId);
      const response = await axios.delete(`/api/members/${memberId}?serverId=${server.id}`);
      router.refresh();
      onOpen("members", { server: response.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId(0);
    }
  }
  const onRoleChange = async (memberId: number, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const response = await axios.patch(`/api/members/${memberId}?serverId=${server.id}`, { role });
      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error)
    } finally {
       setLoadingId(0)
    }
  }

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles};  // tricky
  
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
                Manage Members
            </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
              { server?.members?.length } Members
           </DialogDescription>
        </DialogHeader>
      
      <ScrollArea className="max-h-[420px]">
        {server?.members.map(member => (
           <div key={ member.id} className="flex items-center py-2 gap-x-2">
               <UserAvatar src={member.profile.imageUrl}/>
               <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
              </div>
              { /* we don't show any option for admin and current user is not under update */ }
              { server.profileId !== member.profileId &&
                loadingId !== member.id && (
                   <div className="ml-auto">
                     <DropdownMenu>
                       <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 text-zinc-500"/>
                       </DropdownMenuTrigger>
                     
                       <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                               <ShieldQuestion className="w-4 h-4 mr-2"/>
                               <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                               <DropdownMenuSubContent>
                                 <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                   <Shield className="w-4 h-4 mr-2" />
                                    GUEST
                                    {member.role === "GUEST" && (
                                      <Check
                                        className="h-4 w-4 ml-auto"
                                      />
                                    )}
                                 </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                   <ShieldCheck className="w-4 h-4 mr-2"/>
                                    MODERATOR
                                    {member.role === "MODERATOR" && (
                                      <Check
                                        className="h-4  w-4 ml-auto"
                                      />
                                    )}
                                 </DropdownMenuItem>
                               </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator/>
                          <DropdownMenuItem onClick={() => onKick(member.id)}>
                             <Gavel className="w-4 h-4 mr-2"/>
                             Kick
                          </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </div>
                )}
                { loadingId === member.id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4"/>
                )}
           </div>
        ))}
      </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}