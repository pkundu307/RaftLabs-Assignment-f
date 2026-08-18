import { apiClient } from "@lib/api-client";
import { Cart, AddCartItemRequest, UpdateCartItemRequest } from "../types";

export async function getCart(cartId: string): Promise<Cart> {
  return apiClient.get<Cart>(`/cart/${cartId}`);
}

export async function addToCart(
  cartId: string,
  data: AddCartItemRequest,
): Promise<Cart> {
  return apiClient.post<Cart>(`/cart/${cartId}/items`, data);
}

export async function updateCartItem(
  cartId: string,
  menuItemId: string,
  data: UpdateCartItemRequest,
): Promise<Cart> {
  return apiClient.patch<Cart>(
    `/cart/${cartId}/items/${menuItemId}`,
    data,
  );
}

export async function removeCartItem(
  cartId: string,
  menuItemId: string,
): Promise<Cart> {
  return apiClient.delete<Cart>(`/cart/${cartId}/items/${menuItemId}`);
}
