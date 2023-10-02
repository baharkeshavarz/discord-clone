"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const onConfrim = async () => {
     try {
      setIsLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`);
      
      onClose();
      router.refresh();
      router.push("/")
     } catch (error) {
       setIsLoading(false)
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
              Leave Server
          </DialogTitle>

          <DialogDescription className="text-zinc-500 text-center">
             Are you sure to leave the server <span className="text-indigo-500 font-semibold">{server?.name}</span>?
          </DialogDescription>
       </DialogHeader>

       <DialogFooter className="p-6 bg-gray-100">
         <div className="w-full flex justify-between items-center gap-x-5">
            <Button
               disabled={isLoading}
               variant="ghost"
               onClick={onClose}
            >
              Cancel
            </Button>
            <Button
               disabled={isLoading}
               variant="primary"
               onClick={onConfrim}

            >
              Confirm
            </Button>
         </div>
       </DialogFooter>
    </DialogContent>
    </Dialog>
  )
}