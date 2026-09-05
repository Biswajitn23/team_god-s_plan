import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const governmentCardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "card-government",
        elevated: "card-government shadow-lg hover:shadow-xl",
        outlined: "border-2 border-primary/20 bg-background",
        success: "border-accent/20 bg-accent/5",
        warning: "border-warning/20 bg-warning/5",
        danger: "border-destructive/20 bg-destructive/5",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface GovernmentCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof governmentCardVariants> {}

const GovernmentCard = React.forwardRef<HTMLDivElement, GovernmentCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(governmentCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);

GovernmentCard.displayName = "GovernmentCard";

const GovernmentCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));

GovernmentCardHeader.displayName = "GovernmentCardHeader";

const GovernmentCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-government-lg leading-none tracking-tight", className)}
    {...props}
  />
));

GovernmentCardTitle.displayName = "GovernmentCardTitle";

const GovernmentCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

GovernmentCardDescription.displayName = "GovernmentCardDescription";

const GovernmentCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));

GovernmentCardContent.displayName = "GovernmentCardContent";

const GovernmentCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));

GovernmentCardFooter.displayName = "GovernmentCardFooter";

export {
  GovernmentCard,
  GovernmentCardHeader,
  GovernmentCardFooter,
  GovernmentCardTitle,
  GovernmentCardDescription,
  GovernmentCardContent,
  governmentCardVariants,
};