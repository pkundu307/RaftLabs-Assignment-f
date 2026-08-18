import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../api/cart.api";

export function useCart(cartId: string) {
  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => getCart(cartId),
    enabled: !!cartId,
  });
}

export function useAddToCart(cartId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { menuItemId: string; quantity: number };
    }) => addToCart(cartId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });
}

export function useUpdateCartItem(cartId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      menuItemId,
      data,
    }: {
      menuItemId: string;
      data: { quantity: number };
    }) => updateCartItem(cartId, menuItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });
}

export function useRemoveCartItem(cartId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      menuItemId,
    }: {
      menuItemId: string;
    }) => removeCartItem(cartId, menuItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
  });
}
