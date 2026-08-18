import { apiClient } from "@lib/api-client";
import { MenuItem } from "../types";

export async function getMenu(): Promise<MenuItem[]> {
  return apiClient.get<MenuItem[]>("/menu");
}

export async function getMenuById(id: string): Promise<MenuItem> {
  return apiClient.get<MenuItem>(`/menu/${id}`);
}
