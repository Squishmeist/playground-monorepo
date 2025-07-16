import { Pressable } from "react-native";
import * as Slot from "@rn-primitives/slot";

export function CustomPressable() {
  return (
    <Slot.Pressable
      onPress={() => {
        console.log("Pressed");
      }}
    >
      {/* The `onPress` prop is passed down to the `Pressable` */}
      <Pressable />
    </Slot.Pressable>
  );
}
