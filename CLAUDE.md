# CLAUDE.md

## Project: Food Delivery Order Management — React Client

Build the React client for the food-delivery Order Management assessment. The UI must support menu browsing, server-side cart management, checkout, and order-status tracking. Keep it simple, polished, typed, tested, and easy to explain in the Loom walkthrough.

## 1. Stack

Use:
- React + TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Vitest + React Testing Library
- ESLint + Prettier
- Native `fetch` for HTTP unless there is a strong reason to use Axios

Do not use Redux, WebSockets, SSE, authentication, or a large UI framework unless explicitly requested.

## 2. Architecture

Use a feature-oriented structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   └── layout/
│       ├── Header.tsx
│       └── PageContainer.tsx
├── features/
│   ├── menu/
│   │   ├── api/menu.api.ts
│   │   ├── components/MenuCard.tsx
│   │   ├── components/MenuList.tsx
│   │   ├── hooks/useMenu.ts
│   │   └── types.ts
│   ├── cart/
│   │   ├── api/cart.api.ts
│   │   ├── components/CartItem.tsx
│   │   ├── components/CartList.tsx
│   │   ├── components/CartSummary.tsx
│   │   ├── hooks/useCart.ts
│   │   ├── hooks/useAddToCart.ts
│   │   ├── hooks/useUpdateCartItem.ts
│   │   ├── hooks/useRemoveCartItem.ts
│   │   └── types.ts
│   └── orders/
│       ├── api/order.api.ts
│       ├── components/CheckoutForm.tsx
│       ├── components/OrderSummary.tsx
│       ├── components/OrderStatus.tsx
│       ├── components/OrderTracker.tsx
│       ├── hooks/useCreateOrder.ts
│       ├── hooks/useOrder.ts
│       ├── schemas/checkout.schema.ts
│       └── types.ts
├── lib/
│   ├── api-client.ts
│   ├── query-client.ts
│   └── storage.ts
├── pages/
│   ├── MenuPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   └── OrderTrackingPage.tsx
├── types/api.ts
├── utils/currency.ts
├── utils/errors.ts
├── main.tsx
└── index.css
```

Keep page components responsible for composition. Put API calls in API modules, server-state logic in TanStack Query hooks, form validation in schemas, and reusable UI in components.

Avoid giant components, business logic inside JSX, duplicated API code, `any`, unnecessary abstractions, and premature optimization.

## 3. Routes

Use React Router:

```text
/                 -> redirect to /menu
/menu             -> MenuPage
/cart             -> CartPage
/checkout         -> CheckoutPage
/orders/:orderId  -> OrderTrackingPage
```

## 4. Backend Contract

Backend base path:

```text
/api
```

Environment:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Never hardcode the backend URL in components.

### Menu

```text
GET /api/menu
GET /api/menu/:id
```

Example menu item:

```json
{
  "id": "clx1a2b3c",
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato, mozzarella, and basil",
  "price": 8.99,
  "imageUrl": "https://example.com/pizza.jpg",
  "category": "Pizza"
}
```

### Cart

```text
POST   /api/cart/:cartId/items
GET    /api/cart/:cartId
PATCH  /api/cart/:cartId/items/:menuItemId
DELETE /api/cart/:cartId/items/:menuItemId
```

Add request:

```json
{ "menuItemId": "clx1a2b3c", "quantity": 1 }
```

Update request:

```json
{ "quantity": 3 }
```

Cart response:

```json
{
  "cartId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "items": [
    {
      "menuItemId": "clx1a2b3c",
      "name": "Margherita Pizza",
      "price": 8.99,
      "quantity": 2,
      "imageUrl": "https://example.com/pizza.jpg"
    }
  ],
  "total": 17.98
}
```

### Order

```text
POST  /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
```

Create-order request:

```json
{
  "cartId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "customer": {
    "name": "John Doe",
    "address": "123 Main St, Springfield",
    "phone": "+1-555-123-4567"
  }
}
```

Order statuses are:

```text
ORDER_RECEIVED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
```

Treat backend totals, prices, items, and status as authoritative. Never send client-calculated prices or totals as trusted order data.

## 5. API Client

Create one generic API client in `src/lib/api-client.ts`.

Responsibilities:
- prepend `VITE_API_BASE_URL`
- set JSON headers
- parse JSON safely
- convert non-2xx responses into a typed `ApiError`

Do not put feature-specific business logic in the API client.

Example shape:

```ts
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message ?? "Something went wrong", response.status);
  }

  return data as T;
}
```

## 6. Cart ID

There is no authentication. The backend identifies a cart using a client-generated UUID.

Create `getCartId()` in `src/lib/storage.ts`:

1. Read `food_delivery_cart_id` from localStorage.
2. If present, return it.
3. Otherwise call `crypto.randomUUID()`.
4. Persist it and return it.

Do not generate a new cart ID during every render.

Only the cart ID should be persisted locally. Do not store sensitive customer data in localStorage.

## 7. TanStack Query

Use TanStack Query for all server state:

```text
["menu"]
["cart", cartId]
["order", orderId]
```

Use mutations for:

```text
addCartItem
updateCartItem
removeCartItem
createOrder
updateOrderStatus (only if a UI needs it)
```

After cart mutations, invalidate or update `["cart", cartId]`.

Never use `window.location.reload()` after a mutation.

Do not duplicate menu/cart/order data in Redux, Context, or local component state.

## 8. Menu UI

Menu cards display:
- image
- name
- description
- category when available
- price
- Add to Cart button

Show loading, error, and empty states.

Adding an item should call the backend mutation and refresh/update the cart query without reloading the page.

## 9. Cart UI

Display:
- item image/name
- price
- quantity controls
- remove action
- total
- Proceed to Checkout button

Quantity must never fall below 1. Use DELETE to remove an item rather than PATCHing quantity to zero.

The cart badge should be derived from the cart query:

```ts
cart.items.reduce((total, item) => total + item.quantity, 0)
```

Do not maintain a second manually synchronized cart-count state.

Empty cart:

```text
Your cart is empty.
[Browse Menu]
```

## 10. Checkout

Use React Hook Form + Zod.

Schema:

```ts
const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  address: z.string().trim().min(1, "Address is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number"),
});
```

Checkout page contains:

```text
Delivery Details          Order Summary
Name                      item x quantity
Address                   item price
Phone                     total

             [Place Order]
```

On submit:
1. Validate form.
2. Use the persisted cart ID.
3. Call `POST /api/orders`.
4. Disable the button while pending.
5. Prevent duplicate submissions.
6. On success, navigate to `/orders/:orderId` using the returned order ID.
7. On failure, show a useful error and preserve form values.

Do not trust or send client-calculated totals/prices.

## 11. Order Tracking

Use `useOrder(orderId)` with:

```text
GET /api/orders/:id
```

Display:
- order ID
- current status
- status tracker
- items
- quantities
- price-at-order
- total
- delivery details
- created/updated time where useful

Convert enum names to user-friendly text:

```text
ORDER_RECEIVED   -> Order Received
PREPARING        -> Preparing
OUT_FOR_DELIVERY -> Out for Delivery
DELIVERED        -> Delivered
```

## 12. Polling

The backend simulates status changes. Poll every 3 seconds while the order is active.

Stop polling when status is `DELIVERED`.

Example:

```ts
refetchInterval: (query) => {
  return query.state.data?.status === "DELIVERED" ? false : 3000;
}
```

Do not implement WebSockets/SSE for this assessment.

## 13. Order Status UI

Use a simple progressive tracker:

```text
✓ Order Received
      |
      v
● Preparing
      |
      v
○ Out for Delivery
      |
      v
○ Delivered
```

Make the current state obvious and use accessible text in addition to visual indicators.

## 14. TypeScript Models

Define shared API types in feature `types.ts` files or a shared API types module.

Example:

```ts
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
```

Also type request bodies:

```ts
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
```

Never use `any` to bypass API typing.

## 15. Reusable Components

Create small reusable components only where they provide real value:

```text
Button
Input
LoadingSpinner
ErrorMessage
EmptyState
PageContainer
Header
```

Use semantic HTML. Inputs must have labels, buttons must have meaningful text, and images must have useful `alt` text.

Avoid clickable `<div>` elements.

## 16. Currency

Create `src/utils/currency.ts`:

```ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
```

Use this consistently rather than concatenating currency symbols throughout components.

## 17. Loading, Error, and Empty States

Every API-driven page must explicitly handle:

### Loading
```text
Loading menu...
```

### Error
```text
Unable to load the menu.
[Try Again]
```

### Empty
```text
No menu items available.
```

Do not silently swallow errors or leave blank screens.

For mutations show pending states such as:

```text
Adding...
Updating...
Placing Order...
```

## 18. Responsive UI

Support desktop, tablet, and mobile.

Menu:

```text
Desktop: [Card] [Card] [Card] [Card]
Mobile:  [Card]
         [Card]
```

Checkout:

```text
Desktop: [Form] [Summary]
Mobile:  [Form]
         [Summary]
```

Keep the UI simple rather than spending most of the assessment on visual effects.

## 19. Accessibility

Use:
- semantic HTML
- `<button>` for actions
- `<form>` for forms
- `<label>` for inputs
- meaningful `alt` attributes
- visible focus states
- disabled states for pending operations
- readable status text, not color alone

Do not use a color-only indicator for order status.

## 20. Security Rules

- Never expose database credentials.
- Never put secrets in `VITE_*` environment variables.
- Only the cart ID belongs in localStorage.
- Never trust client prices or totals.
- Do not store unnecessary customer information in browser storage.

## 21. Testing

Use Vitest + React Testing Library. Prefer behavior-focused tests.

### Menu
- renders menu items
- displays price/name
- Add to Cart works
- loading state works
- API error state works

### Cart
- renders items and total
- quantity update works
- remove works
- empty state works
- checkout navigation works

### Checkout
- renders fields
- validation errors appear
- invalid form does not submit
- valid form submits
- button is disabled while pending
- successful checkout navigates to returned order ID
- API failure is displayed

### Order tracking
- order details render
- current status renders correctly
- polling occurs while order is active
- polling stops after `DELIVERED`
- not-found state works

Prefer MSW for API mocking so tests do not require a running backend.

Do not test implementation details unnecessarily.

## 22. Performance

Do not prematurely optimize.

Avoid unnecessary:
- `useMemo`
- `useCallback`
- `React.memo`
- global state
- custom caching

TanStack Query already handles server-state caching and refetching.

## 23. Implementation Order

### Phase 1 — Setup
- Vite React TypeScript project
- ESLint/Prettier
- React Router
- TanStack Query
- React Hook Form
- Zod
- Vitest/Testing Library
- environment variables

### Phase 2 — Foundation
- API client
- typed `ApiError`
- QueryClient
- providers
- router
- common components
- cart ID storage

### Phase 3 — Menu
- types
- API module
- `useMenu`
- MenuCard/MenuList
- MenuPage
- tests

### Phase 4 — Cart
- cart API
- query/mutation hooks
- cart components
- CartPage
- tests

### Phase 5 — Checkout
- order types
- Zod schema
- CheckoutForm
- create-order mutation
- OrderSummary
- CheckoutPage
- tests

### Phase 6 — Tracking
- order API
- `useOrder`
- polling
- OrderTracker
- OrderTrackingPage
- tests

### Phase 7 — Quality

Run:

```bash
npm run lint
npm test
npm run build
```

All must pass before delivery.

## 24. Do Not Add

Unless the requirements change, do not add:

- login/signup
- JWT
- user profiles
- admin dashboard
- restaurant management
- payment gateway
- coupons
- reviews
- favorites
- WebSockets
- SSE
- Redux
- complex state machines
- micro-frontends
- unnecessary backend-management UI

## 25. Assessment-Focused Decisions

Be ready to explain:

### Why TanStack Query?
Menu, cart, and order data are server state. TanStack Query handles caching, mutations, refetching, and polling without a global Redux store.

### Why no Redux?
There is almost no global client state. Introducing Redux would add complexity without solving a real requirement.

### Why localStorage for cartId?
There is no authentication/account system. A generated cart ID lets the backend persist the cart while keeping the client simple.

### Why polling?
The assessment explicitly allows simulated backend status updates. Polling every few seconds is sufficient and avoids unnecessary real-time infrastructure.

### Why React Hook Form + Zod?
It provides clear form state and schema validation while keeping the checkout implementation small.

### Why feature-based structure?
Menu, cart, and orders have distinct responsibilities. Feature boundaries make the code easier to test, maintain, and extend.

## 26. Definition of Done

- [ ] Menu loads from backend
- [ ] Menu items render correctly
- [ ] Items can be added to server-side cart
- [ ] Quantity can be changed
- [ ] Items can be removed
- [ ] Cart total is displayed
- [ ] Empty cart is handled
- [ ] Checkout form validates input
- [ ] Checkout creates an order
- [ ] Duplicate order submission is prevented
- [ ] Successful checkout navigates to order tracking
- [ ] Order details render
- [ ] Order status updates through polling
- [ ] Polling stops at DELIVERED
- [ ] API loading/error states exist
- [ ] Responsive layout works
- [ ] Accessibility basics are implemented
- [ ] Important user flows are tested
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes

## 27. Final Rule

Do not overengineer this frontend.

The target architecture is:

```text
Simple React UI
      +
Feature-based components
      +
Typed API layer
      +
TanStack Query
      +
React Hook Form + Zod
      +
Good loading/error/empty states
      +
Behavior-focused tests
      +
Responsive accessible UI
```

The goal is to demonstrate strong engineering judgment and maintainable React code, not to build a production-scale food-delivery platform.

If a feature is not required by the assessment and does not materially improve the implementation, leave it out.
