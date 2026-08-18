import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrder, updateOrderStatus } from "../api/order.api";
import { Order } from "../types";

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: Order["status"];
    }) => updateOrderStatus(orderId, status),
  });
}
