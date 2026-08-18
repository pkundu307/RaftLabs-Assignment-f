import { useState } from "react";
import { CartItem as CartItemType } from "../types";
import { formatCurrency } from "@utils/currency";
import { Button } from "@components/common/Button";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
  isUpdating?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}: CartItemProps) {
  const [isUpdatingLocal, setIsUpdatingLocal] = useState(false);

  const handleIncrement = async () => {
    setIsUpdatingLocal(true);
    try {
      await onUpdateQuantity(item.menuItemId, item.quantity + 1);
    } finally {
      setIsUpdatingLocal(false);
    }
  };

  const handleDecrement = async () => {
    setIsUpdatingLocal(true);
    try {
      if (item.quantity > 1) {
        await onUpdateQuantity(item.menuItemId, item.quantity - 1);
      } else {
        await onRemove(item.menuItemId);
      }
    } finally {
      setIsUpdatingLocal(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-amber-100">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-xl shadow-md"
      />
      <div className="flex-1 text-center sm:text-left">
        <h4 className="font-bold text-lg text-amber-900 mb-1">{item.name}</h4>
        <p className="text-amber-600 font-semibold text-lg">
          {formatCurrency(item.price)}
        </p>
      </div>
      <div className="flex items-center gap-2 bg-amber-50 rounded-xl p-2">
        <Button
          onClick={handleDecrement}
          variant="secondary"
          size="sm"
          disabled={isUpdatingLocal || isUpdating}
          className="w-10 h-10 p-0"
        >
          -
        </Button>
        <span className="w-10 text-center font-bold text-xl text-amber-900">
          {item.quantity}
        </span>
        <Button
          onClick={handleIncrement}
          variant="secondary"
          size="sm"
          disabled={isUpdatingLocal || isUpdating}
          className="w-10 h-10 p-0"
        >
          +
        </Button>
      </div>
      <button
        onClick={() => onRemove(item.menuItemId)}
        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors group"
        aria-label="Remove item"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
