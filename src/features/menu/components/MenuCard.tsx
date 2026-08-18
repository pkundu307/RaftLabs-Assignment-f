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
  const [imageFailed, setImageFailed] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingLocal(true);
    try {
      await onAddToCart(item.id);
    } finally {
      setIsAddingLocal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-xl hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 group h-full flex flex-col">
      <div className="relative overflow-hidden shrink-0">
        {item.imageUrl && !imageFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            onError={() => setImageFailed(true)}
            className="w-full h-48 sm:h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-amber-50">
            <svg className="w-12 h-12 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {item.category && (
          <span className="absolute top-3 right-3 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-full shadow-md">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-amber-700 mb-4 line-clamp-2 flex-1">
          {item.description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-amber-100">
          <span className="text-xl sm:text-2xl font-bold text-amber-600 tabular-nums">
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