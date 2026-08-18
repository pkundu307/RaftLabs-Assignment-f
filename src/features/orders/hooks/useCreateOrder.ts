import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../api/order.api";
import { CreateOrderRequest } from "../types";

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
  });
}
