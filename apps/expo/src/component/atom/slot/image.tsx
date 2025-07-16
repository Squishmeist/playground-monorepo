import * as Slot from "@rn-primitives/slot";
import { Image } from "lucide-react-native";

export function CustomImage() {
  return (
    <Slot.Image
      source={{ uri: "https://avatars.githubusercontent.com/u/63797719?v=4" }}
    >
      {/* The `source` is passed down to the `View` */}
      <Image />
    </Slot.Image>
  );
}
