import * as React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Portal } from "@rn-primitives/portal";

import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastRoot,
  ToastTitle,
} from "~/component/atom";

export function Example2() {
  const [open, setOpen] = React.useState(false);
  const [seconds, setSeconds] = React.useState(3);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (open) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setOpen(false);
            if (interval) {
              clearInterval(interval);
            }
            return 3;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
      setSeconds(3);
    }

    if (interval && !open) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [open, seconds]);

  return (
    <>
      {open && (
        <Portal name="toast-example">
          <View
            style={{ top: insets.top + 4 }}
            className="absolute w-full px-4"
          >
            <ToastRoot
              type="foreground"
              open={open}
              onOpenChange={setOpen}
              className="flex-row items-center justify-between rounded-xl border-border bg-secondary p-4 opacity-95"
            >
              <View className="gap-1.5">
                <ToastTitle className="text-3xl text-foreground">
                  Here is a toast
                </ToastTitle>
                <ToastDescription className="text-lg text-foreground">
                  It will disappear in {seconds} seconds
                </ToastDescription>
              </View>
              <View className="gap-2">
                <ToastAction className="border border-primary px-4 py-2">
                  <Text className="text-foreground">Action</Text>
                </ToastAction>
                <ToastClose className="border border-primary px-4 py-2">
                  <Text className="text-foreground">Close</Text>
                </ToastClose>
              </View>
            </ToastRoot>
          </View>
        </Portal>
      )}
      <View className="flex-1 items-center justify-center gap-12 p-6">
        <Pressable onPress={() => setOpen((prev) => !prev)}>
          <Text className="text-xl text-foreground">Show Toast</Text>
        </Pressable>
      </View>
    </>
  );
}
