"use client"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface ActionTooltipProps {
    label: string;
    children: React.ReactNode;
    align?: "center" | "start" | "end";
    side?: "right" | "bottom" | "left" | "top";
}

export const ActionTooltip = ({
    label,
    children,
    side,
    align
} : ActionTooltipProps) => {

  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
              <TooltipContent align={align} side={side}>
                 <p className="font-semibold text-sm capitalize">
                    {label.toLowerCase()}
                 </p>
              </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
