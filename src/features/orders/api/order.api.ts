import { apiClient } from "@lib/api-client";
import { Order, CreateOrderRequest } from "../types";

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  return apiClient.post<Order>("/orders", data);
}

export async function getOrder(id: string): Promise<Order> {
  return apiClient.get<Order>(`/orders/${id}`);
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order> {
  return apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
}
