import type { GestureResponderEvent } from "react-native";
import * as React from "react";
import { Pressable, Text, View } from "react-native";
import * as Slot from "@rn-primitives/slot";

import type {
  ActionProps,
  ActionRef,
  CloseProps,
  CloseRef,
  DescriptionProps,
  DescriptionRef,
  RootProps,
  RootRef,
  TitleProps,
  TitleRef,
} from "./type";

interface RootContext extends RootProps {
  nativeID: string;
}
const ToastContext = React.createContext<RootContext | null>(null);

export const ToastRoot = React.forwardRef<RootRef, RootProps>(
  ({ asChild, type = "foreground", open, onOpenChange, ...viewProps }, ref) => {
    const nativeID = React.useId();

    if (!open) return null;

    const Component = asChild ? Slot.View : View;
    return (
      <ToastContext.Provider
        value={{
          open,
          onOpenChange,
          type,
          nativeID,
        }}
      >
        <Component
          ref={ref}
          role="status"
          aria-live={type === "foreground" ? "assertive" : "polite"}
          {...viewProps}
        />
      </ToastContext.Provider>
    );
  },
);

ToastRoot.displayName = "RootToast";

export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error(
      "Toast compound components cannot be rendered outside the Toast component",
    );
  }
  return context;
}

export const ToastClose = React.forwardRef<CloseRef, CloseProps>(
  ({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useToastContext();

    function onPress(ev: GestureResponderEvent) {
      if (disabled) return;
      onOpenChange(false);
      onPressProp?.(ev);
    }

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Component
        ref={ref}
        aria-disabled={disabled ?? undefined}
        role="button"
        onPress={onPress}
        disabled={disabled ?? undefined}
        {...props}
      />
    );
  },
);

ToastClose.displayName = "CloseToast";

export const ToastAction = React.forwardRef<ActionRef, ActionProps>(
  ({ asChild, onPress: onPressProp, disabled = false, ...props }, ref) => {
    const { onOpenChange } = useToastContext();

    function onPress(ev: GestureResponderEvent) {
      if (disabled) return;
      onOpenChange(false);
      onPressProp?.(ev);
    }

    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Component
        ref={ref}
        aria-disabled={disabled ?? undefined}
        role="button"
        onPress={onPress}
        disabled={disabled ?? undefined}
        {...props}
      />
    );
  },
);

ToastAction.displayName = "ActionToast";

export const ToastTitle = React.forwardRef<TitleRef, TitleProps>(
  ({ asChild, ...props }, ref) => {
    const { nativeID } = useToastContext();

    const Component = asChild ? Slot.Text : Text;
    return (
      <Component
        ref={ref}
        role="heading"
        nativeID={`${nativeID}_label`}
        {...props}
      />
    );
  },
);

ToastTitle.displayName = "TitleToast";

export const ToastDescription = React.forwardRef<
  DescriptionRef,
  DescriptionProps
>(({ asChild, ...props }, ref) => {
  const { nativeID } = useToastContext();

  const Component = asChild ? Slot.Text : Text;
  return <Component ref={ref} nativeID={`${nativeID}_desc`} {...props} />;
});

ToastDescription.displayName = "DescriptionToast";
