"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw, icons } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";

export const MembersModal = () => {
  const origin = useOrigin();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles};  //tricky
  
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
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
              </div>
           </div>
        ))}
      </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}