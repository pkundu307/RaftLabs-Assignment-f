// @/pages/MenuPage.tsx
import { useState } from "react";
import { useMenu } from "@features/menu/hooks/useMenu";
import { useCart } from "@features/cart/hooks/useCart";
import { storage } from "@lib/storage";
import { useAddToCart } from "@features/cart/hooks/useCart";
import { MenuCard } from "@features/menu/components/MenuCard";
import { PageContainer } from "@components/layout/PageContainer";
import { LoadingSpinner } from "@components/common/LoadingSpinner";
import { ErrorMessage } from "@components/common/ErrorMessage";
import { EmptyState } from "@components/common/EmptyState";
import { Header } from "@components/layout/Header";

export function MenuPage() {
  const cartId = storage.getCartId();
  const { isLoading: cartLoading } = useCart(cartId);
  const { data: menu, isLoading: menuLoading, error: menuError } = useMenu();
  const addToCartMutation = useAddToCart(cartId);

  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (menuItemId: string) => {
    setError(null);
    try {
      await addToCartMutation.mutateAsync({
        data: { menuItemId, quantity: 1 },
      });
    } catch (err) {
      setError("Failed to add item to cart. Please try again.");
    }
  };

  if (menuLoading || cartLoading) {
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

  if (menuError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ErrorMessage message="Unable to load the menu. Please try again." />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer title="Our Menu">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
      <Header />
      <PageContainer title="Our Menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <p className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-700 mb-3">
              FRESH · DELICIOUS · FAST DELIVERY
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-950 mb-3 sm:mb-4">
              What&apos;s Cooking Today
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-amber-800 max-w-2xl mx-auto leading-relaxed">
              Explore our handcrafted menu featuring the finest ingredients and authentic recipes
            </p>
          </div>

          {error && (
            <div className="mb-6 sm:mb-8">
              <ErrorMessage message={error} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {menu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                isAdding={addToCartMutation.isPending && addToCartMutation.variables?.data.menuItemId === item.id}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}