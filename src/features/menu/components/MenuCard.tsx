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
    <div className="bg-white rounded-xl sm:rounded-2xl border border-amber-200 overflow-hidden hover:shadow-lg hover:shadow-amber-200/50 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-1 group h-full flex flex-col">
      <div className="relative overflow-hidden shrink-0">
        {item.imageUrl && !imageFailed ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            onError={() => setImageFailed(true)}
            className="w-full h-48 sm:h-52 object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 sm:h-52 flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {item.category && (
          <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2.5 sm:px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-md">
            {item.category}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-1.5 sm:mb-2 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs sm:text-sm text-amber-700 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="mt-auto flex justify-between items-center pt-3 sm:pt-4 border-t border-amber-100">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600 tabular-nums">
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