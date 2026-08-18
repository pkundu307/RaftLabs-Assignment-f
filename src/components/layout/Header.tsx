import { Link, useLocation } from "react-router-dom";
import { useCart } from "@features/cart/hooks/useCart";
import { storage } from "@lib/storage";

export function Header() {
  const location = useLocation();
  const cartId = storage.getCartId();
  const { data: cart } = useCart(cartId);

  const totalItemCount = cart?.items.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0
  ) ?? 0;

  const navClasses = (path: string) =>
    `relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      location.pathname === path
        ? "bg-amber-600 text-white shadow-md"
        : "text-amber-900 hover:bg-amber-100"
    }`;

  return (
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/menu" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <svg
                className="w-8 h-8 text-amber-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-50 tracking-wide">
                Cafe Delight
              </span>
              <p className="text-xs text-amber-200 -mt-1">Fresh & Delicious</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Link to="/menu" className={navClasses("/menu")}>
              <svg
                className="w-5 h-5 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Menu
            </Link>
            <Link to="/cart" className={navClasses("/cart")}>
              <div className="relative">
                <svg
                  className="w-5 h-5 inline mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {totalItemCount}
                  </span>
                )}
              </div>
              Cart
            </Link>
          </nav>
        </div>
      </div>
      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
    </header>
  );
}
