"use client";

import * as React from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Input, InputProps } from "./input";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

export interface InputPasswordProps extends InputProps {
    showCapsLockWarning?: boolean;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
    ({ className, showCapsLockWarning = true, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const [capsLockActive, setCapsLockActive] = React.useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            // getModifierState is reliable for detecting CapsLock
            const capsLock = e.getModifierState("CapsLock");
            setCapsLockActive(capsLock);

            if (props.onKeyDown) {
                props.onKeyDown(e);
            }
        };

        // Also check on click/focus just in case state changed elsewhere
        const checkCapsLock = (e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
            const event = e.nativeEvent;
            if (event instanceof KeyboardEvent || event instanceof MouseEvent) {
                const capsLock = event.getModifierState("CapsLock");
                setCapsLockActive(capsLock);
            }
        }

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            checkCapsLock(e);
            props.onFocus?.(e);
        };

        const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
            checkCapsLock(e);
            props.onClick?.(e);
        };

        return (
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-10", className)}
                    ref={ref}
                    {...props}
                    onKeyDown={handleKeyDown}
                    onClick={handleClick}
                    onFocus={handleFocus}
                />
                <div className="absolute top-0 right-0 h-full flex items-center px-1">
                    {showCapsLockWarning && capsLockActive && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="p-2 text-yellow-500 animate-pulse">
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Caps Lock menyala</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-2 py-0 text-slate-500 hover:text-blue-600 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1} // Skip tabbing to this button
                        disabled={props.disabled}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </Button>
                </div>
            </div>
        );
    }
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
