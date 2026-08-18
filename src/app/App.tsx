// @/app/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { MenuPage } from "@pages/MenuPage";
import { CartPage } from "@pages/CartPage";
import { CheckoutPage } from "@pages/CheckoutPage";
import { OrderTrackingPage } from "@pages/OrderTrackingPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/menu" replace />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
    </Routes>
  );
}
