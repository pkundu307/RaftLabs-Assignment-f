// @/pages/CheckoutPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@features/cart/hooks/useCart";
import { useCreateOrder } from "@features/orders/hooks/useCreateOrder";
import { storage } from "@lib/storage";
import { PageContainer } from "@components/layout/PageContainer";
import { LoadingSpinner } from "@components/common/LoadingSpinner";
import { EmptyState } from "@components/common/EmptyState";
import { CheckoutForm } from "@features/orders/components/CheckoutForm";
import { OrderSummary } from "@features/orders/components/OrderSummary";
import { ROUTES } from "@app/router";
import type { CartItem } from "@features/cart/types";
import { Navbar } from "@components/layout/Navbar";
import { ChevronLeft } from "lucide-react";

export function CheckoutPage() {
  const navigate = useNavigate();
  const cartId = storage.getCartId();
  const { data: cart, isLoading } = useCart(cartId);
  const createOrderMutation = useCreateOrder();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!cart || cart.items.length === 0)) {
      navigate(ROUTES.CART);
    }
  }, [cart, isLoading, navigate]);

  const handleCheckout = async (formData: {
    name: string;
    address: string;
    phone: string;
  }) => {
    setError(null);

    try {
      const order = await createOrderMutation.mutateAsync({
        cartId,
        customer: formData,
      });
      navigate(ROUTES.ORDER(order.id));
    } catch (err) {
      setError(
        "Failed to place order. Please check your information and try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="max-w-6xl mx-auto px-5">
            <EmptyState
              title="Your cart is empty"
              description="Add items to your cart before checking out."
              actionLabel="Go to Cart"
              onAction={() => navigate(ROUTES.CART)}
            />
          </div>
        </PageContainer>
      </div>
    );
  }

  const cartItemsAsOrderItems = cart.items.map((item: CartItem) => ({
    menuItemId: item.menuItemId,
    name: item.name,
    quantity: item.quantity,
    priceAtOrder: item.price,
  }));

  return (
    <div className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <PageContainer title="Checkout">
        <div className="max-w-6xl mx-auto px-5 pb-20">
          <button
            onClick={() => navigate(ROUTES.CART)}
            className="flex items-center gap-1 text-sm mb-6 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ChevronLeft size={16} /> Back to cart
          </button>

          <h1 className="text-3xl font-serif font-semibold text-neutral-900 mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/60 rounded-2xl border border-neutral-200 p-4 sm:p-6">
              <CheckoutForm
                onSubmit={handleCheckout}
                isSubmitting={createOrderMutation.isPending}
                error={error}
              />
            </div>
            <div>
              <div className="lg:sticky lg:top-24">
                <OrderSummary
                  items={cartItemsAsOrderItems}
                  total={cart.total}
                />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}