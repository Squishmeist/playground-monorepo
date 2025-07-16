import * as React from "react";
import { Text as RNText } from "react-native";
import * as Slot from "@rn-primitives/slot";

import { cn } from "~/utils/style";

export const TextClassContext = React.createContext<string | undefined>(
  undefined,
);

export interface TextProps extends React.ComponentProps<typeof RNText> {
  ref?: React.RefObject<RNText>;
  asChild?: boolean;
}

export function Text({ className, asChild = false, ...props }: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(
        "web:select-text text-base text-foreground",
        textClass,
        className,
      )}
      {...props}
    />
  );
}
