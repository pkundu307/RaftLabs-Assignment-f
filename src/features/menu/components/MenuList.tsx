// @/features/menu/components/MenuList.tsx
import { MenuItem } from "../types";
import { MenuCard } from "./MenuCard";

interface MenuListProps {
  items: MenuItem[];
  onAddToCart: (itemId: string) => void;
  isAdding?: boolean;
}

export function MenuList({ items, onAddToCart, isAdding }: MenuListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          isAdding={isAdding}
        />
      ))}
    </div>
  );
}