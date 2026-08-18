import { useQuery } from "@tanstack/react-query";
import { getMenu, getMenuById } from "../api/menu.api";

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menu", id],
    queryFn: () => getMenuById(id),
    enabled: !!id,
  });
}
