const CART_ID_KEY = "food_delivery_cart_id";

function getCartId(): string {
  let cartId = localStorage.getItem(CART_ID_KEY);

  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem(CART_ID_KEY, cartId);
  }

  return cartId;
}

function clearCartId(): void {
  localStorage.removeItem(CART_ID_KEY);
}

export const storage = {
  getCartId,
  clearCartId,
};
