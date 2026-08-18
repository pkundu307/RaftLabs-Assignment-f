export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string | null;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  total: number;
}

export type OrderStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  cartId: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
}
