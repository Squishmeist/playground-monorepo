import * as Slot from "@rn-primitives/slot";

export function CustomView({ isChild = true }) {
  const Component = isChild ? Slot.View : Slot.View;
  return (
    <Component className="bg-red-500">
      {/* The `className` is passed down to the `View` with `key="x"` when `isChild` is `true` */}
      <Slot.View key="x" />
    </Component>
  );
}
