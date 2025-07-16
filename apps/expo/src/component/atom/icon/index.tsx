import type { LucideIcon } from "lucide-react-native";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react-native";
import { cssInterop } from "nativewind";

export function iconWithClassName(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}

iconWithClassName(Check);
iconWithClassName(ChevronDown);
iconWithClassName(ChevronRight);
iconWithClassName(ChevronUp);
export { Check, ChevronDown, ChevronRight, ChevronUp };
