import { CartItem as CartItemType } from "../types";
import { CartItem } from "./CartItem";

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
  isUpdating?: boolean;
}

export function CartList({
  items,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.menuItemId}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}
