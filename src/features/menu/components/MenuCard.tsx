// @/features/menu/components/MenuCard.tsx
import { useState } from "react";
import { MenuItem } from "../types";
import { formatCurrency } from "@utils/currency";
import { Button } from "@components/common/Button";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (itemId: string) => void;
  isAdding?: boolean;
}

export function MenuCard({
  item,
  onAddToCart,
  isAdding = false,
}: MenuCardProps) {
  const [isAddingLocal, setIsAddingLocal] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingLocal(true);
    try {
      await onAddToCart(item.id);
    } finally {
      setIsAddingLocal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.category && (
          <span className="absolute top-3 right-3 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-full shadow-md">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold text-neutral-900 mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
          <span className="text-2xl font-semibold text-neutral-900 tabular-nums">
            {formatCurrency(item.price)}
          </span>
          <Button
            onClick={handleAddToCart}
            isLoading={isAddingLocal || isAdding}
            variant="primary"
            size="sm"
            fullWidth
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}