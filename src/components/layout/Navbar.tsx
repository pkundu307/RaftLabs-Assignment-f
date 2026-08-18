// @/components/layout/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "@features/cart/hooks/useCart";
import { storage } from "@lib/storage";
import { ROUTES } from "@app/router";
import type { CartItem } from "@features/cart/types";

export function Navbar() {
  const location = useLocation();
  const cartId = storage.getCartId();
  const { data: cart } = useCart(cartId);

  const itemCount =
    cart?.items?.reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0,
    ) ?? 0;

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === ROUTES.MENU && location.pathname === "/");

  return (
    <header className="sticky top-0 z-20 bg-neutral-900 shadow-md">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Link to={ROUTES.MENU} className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center transition-transform group-hover:rotate-12">
            <UtensilsCrossed size={18} className="text-white" />
          </span>
          <span className="text-lg font-serif font-semibold tracking-tight text-white">
            Ember Market
          </span>
        </Link>

        <nav className="flex items-center gap-1.5">
          <Link
            to={ROUTES.MENU}
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive(ROUTES.MENU)
                ? "bg-orange-600 text-white"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Menu
          </Link>

          <Link
            to={ROUTES.CART}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive(ROUTES.CART)
                ? "bg-orange-600 text-white"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white bg-amber-500">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}