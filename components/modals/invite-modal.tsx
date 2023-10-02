"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";

export const InviteModal = () => {
  const origin = useOrigin();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  
  // Copy the link
  const invitedUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(invitedUrl); // copy to clipboard
    setCopied(true)
  }
  useEffect(() => {
      setTimeout(() => {
         setCopied(false)
      }, 1000)
  }, [copied])

  // Generate new link
  const onNew = async () => {
     setIsLoading(true)
     try {
        const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
        onOpen("invite", { server:  response.data})
     } catch (error) {
        console.log(error)
     } finally {
        setIsLoading(false)
     }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
             Invite Friends
          </DialogTitle>
       </DialogHeader>
       <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
         <div className="py-2 space-x-1 flex justify-center">
            <Input 
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 border-0"
                  value={invitedUrl}       
            />
            <Button 
                  onClick={onCopy}
                  disabled={isLoading}
                  size="icon"
                  >
                { copied 
                         ? 
                           <Check className="w-4 h-4"/>
                         :
                          <Copy className="w-4 h-4"/>
                }
           </Button>
          </div>
           <Button 
                  onClick={onNew}
                  disabled={isLoading}
                  variant="link"
                  size="sm"
                  className="text-xs text-zinc-500"
                 >
               Generate a new link
               <RefreshCcw className="w-4 h-4 ml-2" />
            </Button>
       </div>
      </DialogContent>
    </Dialog>
  )
}