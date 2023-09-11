import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils";
import React from 'react'

interface UserAvatarProps {
    src: string,
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    className
}) => {
  return (
    <Avatar className={cn(
                           "w-7 h-7 md:h-10 md:w-10",
                           className
                           )}>
       <AvatarImage src={src}/>
       <AvatarFallback>CN</AvatarFallback>
     </Avatar>
  )
}
