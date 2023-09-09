"use client"

import Image from "next/image"
import { ActionTooltip } from "../action-tooltip"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"

interface NavigationItemProps {
    id: string,
    name: string,
    imageUrl: string,
}

const NavigationItem = ({
    id,
    name,
    imageUrl
} : NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
      router.push(`/servers/${id}`)
  }

  return (
     <ActionTooltip
         label={name}
         align="center"
         side="right"
         >
         <button
             className="group relative flex justify-center"
             onClick={handleClick}
             >
            <div className={cn(
                              "absolute left-0 top-0 w-[2px] rounded-r-full h-full bg-slate-400 z-50",
                              params?.serverId === id ? "h=[36px]" : "h-[8px]",
                              params?.serverId !== id && "group-hover:h-[20px]",
                              )} />
             <div className="relative group h-[48px] w-[48px] rounded-[24px] mx-3 group-hover:rounded-[16px] transition "> 
                  <Image
                      src={imageUrl}
                      fill
                      alt={name}
                    />
           </div>
         </button>
     </ActionTooltip>
    
  )
}

export default NavigationItem