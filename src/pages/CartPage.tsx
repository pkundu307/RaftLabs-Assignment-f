// @/pages/CartPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@features/cart/hooks/useCart";
import { useUpdateCartItem } from "@features/cart/hooks/useCart";
import { useRemoveCartItem } from "@features/cart/hooks/useCart";
import { storage } from "@lib/storage";
import { PageContainer } from "@components/layout/PageContainer";
import { LoadingSpinner } from "@components/common/LoadingSpinner";
import { ErrorMessage } from "@components/common/ErrorMessage";
import { EmptyState } from "@components/common/EmptyState";
import { CartList } from "@features/cart/components/CartList";
import { CartSummary } from "@features/cart/components/CartSummary";
import { ROUTES } from "@app/router";
import type { CartItem } from "@features/cart/types";
import { Header } from "@components/layout/Header";

export function CartPage() {
  const navigate = useNavigate();
  const cartId = storage.getCartId();
  const { data: cart, isLoading, error } = useCart(cartId);
  const updateCartItemMutation = useUpdateCartItem(cartId);
  const removeCartItemMutation = useRemoveCartItem(cartId);

  const [errorState, setErrorState] = useState<string | null>(null);

  const handleUpdateQuantity = async (
    menuItemId: string,
    quantity: number,
  ) => {
    setErrorState(null);
    try {
      await updateCartItemMutation.mutateAsync({
        menuItemId,
        data: { quantity },
      });
    } catch (err) {
      setErrorState("Failed to update cart. Please try again.");
    }
  };

  const handleRemoveItem = async (menuItemId: string) => {
    setErrorState(null);
    try {
      await removeCartItemMutation.mutateAsync({
        menuItemId,
      });
    } catch (err) {
      setErrorState("Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer>
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ErrorMessage message="Unable to load your cart. Please try again." />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer title="Your Cart">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {errorState && (
              <div className="mb-6">
                <ErrorMessage message={errorState} />
              </div>
            )}
            <EmptyState
              title="Your cart is empty"
              description="Add some delicious items from our menu."
              actionLabel="Browse Menu"
              onAction={() => navigate(ROUTES.MENU)}
            />
          </div>
        </PageContainer>
      </div>
    );
  }

  const totalItemCount = cart.items.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
      <Header />
      <PageContainer title="Your Shopping Cart">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <button
            onClick={() => navigate(ROUTES.MENU)}
            className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 mb-6 sm:mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </button>

          {errorState && (
            <div className="mb-6">
              <ErrorMessage message={errorState} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-3 sm:space-y-4">
                <CartList
                  items={cart.items}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  isUpdating={
                    updateCartItemMutation.isPending ||
                    removeCartItemMutation.isPending
                  }
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <CartSummary
                  total={cart.total}
                  itemCount={totalItemCount}
                  onCheckout={handleCheckout}
                  isCheckoutDisabled={
                    updateCartItemMutation.isPending ||
                    removeCartItemMutation.isPending
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}