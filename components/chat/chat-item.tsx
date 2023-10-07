"use client"

import React, { useEffect, useState } from 'react'
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import { Member, MemberRole, Profile } from "@prisma/client";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
  } from "@/components/ui/form";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import qs from "query-string";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

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

const roleIconMap = {
        "GUEST": null,
        "MODERATOR": <ShieldCheck className="h-4 w-5 ml-2 text-indigo-500"/>,
        "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"/>
 }

const formSchema = z.object({
    content: z.string().min(1)
})

export const ChatItem = ({
  id, // message.id
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
  const fileType = fileUrl?.split(".").pop();  
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const [isEditting, setIsEditting] = useState(false)
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        content: content
    }
  })

  useEffect(() => {
   form.reset({
      content: content
   })
  }, [content])

  // Cancel editing on press "Escape"
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.key === 27) {
         setIsEditting(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

   const isLoading = form.formState.isSubmitting;
   const onSubmit = async (values: z.infer<typeof formSchema>) => {
     try {
        const url = qs.stringifyUrl({
            url: `/${socketUrl}/${id}`,
            query: socketQuery,
        })
        await axios.patch(url, values)
        form.reset();
        setIsEditting(false);
     } catch (error) {
        console.log(error)
     }
   }
 
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
        <div className="group flex items-start gap-x-2 w-full">
           <div className="cursor-poniter hover:drop-shadow-md transition">
              <UserAvatar src={member.profile.imageUrl} />
           </div>

           <div className="flex flex-col w-full">
              <div className="flex items-center">
                   <div className="flex items-center gap-x-2">
                    <p onClick={() => {}} className="font-semibold text-sm hover:underline cursor-pointer">
                       {member.profile.name}
                     </p>
                    <ActionTooltip label={member.role}>
                       <p>{roleIconMap[member.role]}</p>
                    </ActionTooltip>
                   
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm"> 
                       {timestamp}
                      </span> 
                  </div>
             </div>

             {isImage && (
                     <a 
                       href={fileUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="relative aspect-square rounded-md mt-2 
                                 overflow-hidden border flex items-center bg-secondary
                                 h-48 w-48"
                         >
                        <Image
                           src={fileUrl}
                           alt={content}
                           fill
                           className="object-cover"
                          />
                     </a>
              )}

             {isPDF && (
              <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                    <a 
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                     PDF File
                  </a>
            </div>
             )}  

             {!fileUrl && !isEditting && (
                 <p className={cn("text-sm text-zinc-600 dark:text-zinc-300",
                                  deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                                 )}>
                    {content}
                    {isUpdated && !deleted && (
                        <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                            (edited)
                        </span>
                    )}
                 </p>
             )}

             {!fileUrl && isEditting && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex items-center w-full gap-x/2 pt-2"
                      >
                        <FormField
                           control={form.control}
                           name="content"
                           render={({ field }) => (
                              <FormItem className="flex-1">
                                  <FormControl>
                                     <div className="relative w-full">
                                       <Input
                                          disabled={isLoading}
                                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                          placeholder="Edited message"
                                          {...field}
                                      />
                                     </div>
                                  </FormControl>
                               </FormItem>
                           )}
                        />   
                        <Button variant="primary" size="sm">
                            Save
                        </Button>                    
                    </form>
                    <span className="text-[10px] mt-1 text-zinc-400">
                        Press escape to cancel, enter to save
                    </span>
                </Form>
             )}
            </div>
        </div>
        {canDeleteMessage && (
            <div className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-5 bg-white dark:bg-zinc-900 p-1 border rounded-sm">
               {canEditMessage && (
                 <ActionTooltip label="Edit">
                    <Edit 
                      onClick={() => setIsEditting(true)}
                      className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                      />
                 </ActionTooltip>
               )}
                <ActionTooltip label="Delete">
                   <Trash 
                     onClick={() => onOpen("deleteMessage", {
                         apiUrl: `/${socketUrl}/${id}`,
                         query: socketQuery,
                     })}
                     className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                   />
                </ActionTooltip>
            </div>
           )}
    </div>
  )
}
