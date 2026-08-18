// @/pages/MenuPage.tsx
import { useState } from "react";
import { useMenu } from "@features/menu/hooks/useMenu";
import { useCart } from "@features/cart/hooks/useCart";
import { storage } from "@lib/storage";
import { useAddToCart } from "@features/cart/hooks/useCart";
import { MenuList } from "@features/menu/components/MenuList";
import { PageContainer } from "@components/layout/PageContainer";
import { LoadingSpinner } from "@components/common/LoadingSpinner";
import { ErrorMessage } from "@components/common/ErrorMessage";
import { EmptyState } from "@components/common/EmptyState";
import { Navbar } from "@components/layout/Navbar";

export function MenuPage() {
  const cartId = storage.getCartId();
  const { isLoading: cartLoading } = useCart(cartId);
  const { data: menu, isLoading: menuLoading, error: menuError } = useMenu();
  const addToCartMutation = useAddToCart();

  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (menuItemId: string) => {
    setError(null);
    try {
      await addToCartMutation.mutateAsync({
        cartId,
        data: { menuItemId, quantity: 1 },
      });
    } catch (err) {
      setError("Failed to add item to cart. Please try again.");
    }
  };

  if (menuLoading || cartLoading) {
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

  if (menuError) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="max-w-6xl mx-auto px-5 pt-10">
            <ErrorMessage message="Unable to load the menu. Please try again." />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer title="Menu">
          <div className="max-w-6xl mx-auto px-5">
            <EmptyState
              title="No menu items available"
              description="Check back later for our delicious offerings."
              actionLabel="Refresh"
              onAction={() => window.location.reload()}
            />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <PageContainer title="Menu">
        <div className="max-w-6xl mx-auto px-5 pb-20">
          <div className="pt-10 pb-8">
            <p className="text-xs tracking-[0.2em] uppercase text-orange-700 mb-2">
              Open till late · Delivered hot
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-neutral-900 mb-3">
              Fire-kissed street food,
              <br className="hidden sm:block" /> dropped at your door.
            </h1>
            <p className="text-sm max-w-md text-neutral-500">
              A rotating lineup of the best night-market dishes from around
              the world, cooked to order.
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          <div className="bg-white/60 rounded-2xl border border-neutral-200 p-4 sm:p-6">
            <MenuList
              items={menu}
              onAddToCart={handleAddToCart}
              isAdding={addToCartMutation.isPending}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}