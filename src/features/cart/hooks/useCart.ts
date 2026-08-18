import { useQuery, useMutation } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../api/cart.api";

export function useCart(cartId: string) {
  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => getCart(cartId),
    enabled: !!cartId,
  });
}

export function useAddToCart() {
  return useMutation({
    mutationFn: ({
      cartId,
      data,
    }: {
      cartId: string;
      data: { menuItemId: string; quantity: number };
    }) => addToCart(cartId, data),
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({
      cartId,
      menuItemId,
      data,
    }: {
      cartId: string;
      menuItemId: string;
      data: { quantity: number };
    }) => updateCartItem(cartId, menuItemId, data),
  });
}

export function useRemoveCartItem() {
  return useMutation({
    mutationFn: ({
      cartId,
      menuItemId,
    }: {
      cartId: string;
      menuItemId: string;
    }) => removeCartItem(cartId, menuItemId),
  });
}
