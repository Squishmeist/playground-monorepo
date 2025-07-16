import * as Slot from "@rn-primitives/slot";
import { Text } from "lucide-react-native";

export function CustomText() {
  return (
    <Slot.Text className="text-blue-500">
      {/* The `className` is passed down to the `View` */}
      <Text />
    </Slot.Text>
  );
}
