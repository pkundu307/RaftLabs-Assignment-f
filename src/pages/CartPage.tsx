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
import { Navbar } from "@components/layout/Navbar";
import { ChevronLeft } from "lucide-react";

export function CartPage() {
  const navigate = useNavigate();
  const cartId = storage.getCartId();
  const { data: cart, isLoading, error } = useCart(cartId);
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();

  const [errorState, setErrorState] = useState<string | null>(null);

  const handleUpdateQuantity = async (
    menuItemId: string,
    quantity: number,
  ) => {
    setErrorState(null);
    try {
      await updateCartItemMutation.mutateAsync({
        cartId,
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
        cartId,
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="max-w-6xl mx-auto px-5 pt-10">
            <ErrorMessage message="Unable to load your cart. Please try again." />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer title="Your Cart">
          <div className="max-w-6xl mx-auto px-5">
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
    <div className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <PageContainer title="Your Cart">
        <div className="max-w-6xl mx-auto px-5 pb-20">
          <button
            onClick={() => navigate(ROUTES.MENU)}
            className="flex items-center gap-1 text-sm mb-6 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ChevronLeft size={16} /> Back to menu
          </button>

          <h1 className="text-3xl font-serif font-semibold text-neutral-900 mb-8">
            Your Cart
          </h1>

          {errorState && (
            <div className="mb-6">
              <ErrorMessage message={errorState} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white/60 rounded-2xl border border-neutral-200 p-4 sm:p-6">
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