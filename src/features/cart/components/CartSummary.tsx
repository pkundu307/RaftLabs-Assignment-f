import { formatCurrency } from "@utils/currency";
import { Button } from "@components/common/Button";

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

export function CartSummary({
  total,
  itemCount,
  onCheckout,
  isCheckoutDisabled = false,
}: CartSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl shadow-xl border border-amber-200 sticky top-4">
      <div className="flex items-center mb-4">
        <svg
          className="w-6 h-6 text-amber-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-xl font-bold text-amber-900">Cart Summary</h3>
      </div>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-amber-100">
          <span className="text-amber-700">Items ({itemCount})</span>
          <span className="font-semibold text-amber-900">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-amber-100">
          <span className="text-amber-700">Delivery Fee</span>
          <span className="font-semibold text-amber-900">{formatCurrency(2.99)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-amber-100">
          <span className="text-amber-700">Tax (10%)</span>
          <span className="font-semibold text-amber-900">{formatCurrency(total * 0.1)}</span>
        </div>
        <div className="flex justify-between items-center pt-3">
          <span className="text-xl font-bold text-amber-900">Total</span>
          <span className="text-2xl font-bold text-amber-600">
            {formatCurrency(total + 2.99 + total * 0.1)}
          </span>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        fullWidth
        size="lg"
        variant="primary"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Proceed to Checkout
      </Button>
    </div>
  );
}
