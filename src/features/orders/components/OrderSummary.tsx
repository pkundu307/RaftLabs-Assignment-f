import { OrderItem } from "@/types/api";
import { formatCurrency } from "@utils/currency";

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.name} x {item.quantity}
            </span>
            <span className="font-medium">
              {formatCurrency(item.priceAtOrder * item.quantity)}
            </span>
          </div>
        ))}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
