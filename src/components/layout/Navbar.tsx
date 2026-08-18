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
    <header className="sticky top-0 z-20 bg-neutral-900 shadow-md overflow-visible">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Link to={ROUTES.MENU} className="flex items-center gap-2 group shrink-0">
          <span className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center transition-transform group-hover:rotate-12 shrink-0">
            <UtensilsCrossed size={18} className="text-white" />
          </span>
          <span className="text-lg font-serif font-semibold tracking-tight text-white whitespace-nowrap">
            Ember Market
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to={ROUTES.MENU}
            className={`px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              isActive(ROUTES.MENU)
                ? "bg-orange-600 text-white"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            Menu
          </Link>

          <Link
            to={ROUTES.CART}
            className={`relative flex items-center gap-1.5 pl-3.5 pr-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              isActive(ROUTES.CART)
                ? "bg-orange-600 text-white"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <ShoppingCart size={16} className="shrink-0" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center text-white bg-amber-500 ring-2 ring-neutral-900">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}