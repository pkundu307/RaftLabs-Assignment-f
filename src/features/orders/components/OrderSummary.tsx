import { OrderItem } from "@/types/api";
import { formatCurrency } from "@utils/currency";

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-amber-200">
      <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-4 sm:mb-5 flex items-center gap-2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Order Summary
      </h3>
      <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between text-sm py-2 border-b border-amber-100 last:border-0">
            <span className="text-amber-700">
              {item.name} x <span className="font-semibold">{item.quantity}</span>
            </span>
            <span className="font-semibold text-amber-900">
              {formatCurrency(item.priceAtOrder * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="font-bold text-amber-900">Total Amount</span>
          <span className="text-xl sm:text-2xl font-bold text-amber-600">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
