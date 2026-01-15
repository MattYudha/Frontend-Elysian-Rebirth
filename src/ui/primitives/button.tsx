import React from 'react';
import { Button as ShadcnButton, type ButtonProps } from '@/ui/button';
import { cn } from '@/lib/utils';

/**
 * Button primitive - wraps shadcn/ui Button with project defaults
 * All project components should import from here, not from @/ui directly
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
    return (
        <ShadcnButton
            ref={ref}
            className={cn('transition-all duration-200', className)}
            {...props}
        />
    );
});
Button.displayName = "Button";

export type { ButtonProps };
