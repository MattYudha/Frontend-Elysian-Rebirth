"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface TenantMember {
    id: string
    name: string
    avatarUrl?: string
    role?: "admin" | "member" | "viewer"
}

export interface TenantAvatarGroupProps {
    members: TenantMember[]
    max?: number
    className?: string
    /**
     * Optional size modifier for the avatars. Default is size-8.
     */
    size?: "sm" | "default" | "lg"
}

export function TenantAvatarGroup({ members, max = 3, className, size = "default" }: TenantAvatarGroupProps) {
    const visible = members.slice(0, max)
    const remaining = Math.max(0, members.length - visible.length)

    const sizeClasses = {
        sm: "size-6 text-[9px]",
        default: "size-8 text-xs",
        lg: "size-10 text-sm",
    }

    const offsetClasses = {
        sm: "-ml-1.5",
        default: "-ml-2.5",
        lg: "-ml-3",
    }

    return (
        <TooltipProvider delayDuration={150}>
            <div className={cn("flex items-center", className)}>
                {visible.map((member, idx) => {
                    const initials = member.name
                        .split(" ")
                        .filter(Boolean)
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()

                    return (
                        <Tooltip key={member.id}>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "relative hover:z-10 transition-transform hover:scale-110 duration-200 cursor-pointer",
                                        idx === 0 ? "" : offsetClasses[size]
                                    )}
                                >
                                    <Avatar className={cn(
                                        "border-2 border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-slate-50",
                                        sizeClasses[size]
                                    )}>
                                        {member.avatarUrl ? (
                                            <AvatarImage alt={member.name} src={member.avatarUrl} className="object-cover" />
                                        ) : null}
                                        <AvatarFallback className="font-medium text-slate-600 bg-gradient-to-br from-slate-100 to-slate-200">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    {member.role === 'admin' && (
                                        <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-blue-500 rounded-full border-2 border-white" title="Admin" />
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                sideOffset={8}
                                className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-lg px-3 py-2"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-semibold text-slate-800 text-sm">{member.name}</span>
                                    {member.role && (
                                        <span className="text-xs text-slate-500 capitalize">{member.role}</span>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}

                {remaining > 0 ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    "relative hover:z-10 transition-transform hover:scale-110 duration-200 cursor-pointer",
                                    offsetClasses[size]
                                )}
                            >
                                <div className={cn(
                                    "rounded-full border-2 border-white/80 bg-slate-100/90 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center font-medium text-slate-600",
                                    sizeClasses[size]
                                )}>
                                    +{remaining}
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent
                            sideOffset={8}
                            className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-xl rounded-lg px-3 py-2 cursor-default"
                        >
                            <span className="text-sm font-medium text-slate-700">
                                {remaining} more member{remaining > 1 ? 's' : ''}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                ) : null}
            </div>
        </TooltipProvider>
    )
}
