export const ROUTES = {
  ROOT: "/",
  MENU: "/menu",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER: (orderId: string) => `/orders/${orderId}`,
} as const;
