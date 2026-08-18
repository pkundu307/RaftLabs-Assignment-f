// @/pages/OrderTrackingPage.tsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useOrder } from "@features/orders/hooks/useOrder";
import { PageContainer } from "@components/layout/PageContainer";
import { LoadingSpinner } from "@components/common/LoadingSpinner";
import { ErrorMessage } from "@components/common/ErrorMessage";
import { OrderTracker } from "@features/orders/components/OrderTracker";
import { OrderSummary } from "@features/orders/components/OrderSummary";
import { useState } from "react";
import { Navbar } from "@components/layout/Navbar";
import { Link } from "react-router-dom";
import { ROUTES } from "@app/router";
import { ChevronLeft, User, MapPin, Phone, Hash, Clock } from "lucide-react";

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ORDER_RECEIVED: "Order Received",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  };
  return labels[status] || status;
}

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [polling, setPolling] = useState(true);
  const { data: order, isLoading, error, refetch } = useOrder(orderId || "");

  useEffect(() => {
    if (!orderId) return;
    if (!order || !polling) return;

    if (order.status === "DELIVERED") {
      setPolling(false);
      return;
    }

    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, order, polling, refetch]);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="max-w-6xl mx-auto px-5 pt-10">
            <ErrorMessage message="Invalid order ID" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="max-w-6xl mx-auto px-5 pt-10">
            <ErrorMessage message="Order not found" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FDF9F0]">
        <Navbar />
        <PageContainer>
          <div className="max-w-6xl mx-auto px-5 pt-10">
            <ErrorMessage message="Order not found" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF9F0]">
      <Navbar />
      <PageContainer title="Order Tracking">
        <div className="max-w-6xl mx-auto px-5 pb-20">
          <Link
            to={ROUTES.MENU}
            className="flex items-center gap-1 text-sm mb-6 text-neutral-500 hover:text-neutral-800 transition-colors w-fit"
          >
            <ChevronLeft size={16} /> Back to menu
          </Link>

          <div className="flex items-center justify-between flex-wrap gap-2 mb-8">
            <h1 className="text-3xl font-serif font-semibold text-neutral-900">
              Order Tracking
            </h1>
            <span className="text-xs px-3 py-1.5 rounded-full font-mono bg-neutral-200 text-neutral-600">
              #{order.id}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/60 rounded-2xl border border-neutral-200 p-4 sm:p-6">
                <OrderTracker status={order.status} />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 mb-4">
                  Delivery Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <User size={15} className="text-neutral-400 shrink-0" />
                    <span className="text-neutral-700">
                      {order.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-neutral-400 shrink-0" />
                    <span className="text-neutral-700">
                      {order.customer.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={15} className="text-neutral-400 shrink-0" />
                    <span className="text-neutral-700">
                      {order.customer.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Hash size={15} className="text-neutral-400 shrink-0" />
                    <span className="text-neutral-700 text-xs break-all">
                      {order.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-neutral-400 shrink-0" />
                    <span className="text-neutral-700">
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="lg:sticky lg:top-24 space-y-6">
                <OrderSummary items={order.items} total={order.totalAmount} />

                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 mb-3">
                    Order Timeline
                  </h3>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <div>
                      Created: {new Date(order.createdAt).toLocaleString()}
                    </div>
                    {order.updatedAt !== order.createdAt && (
                      <div>
                        Updated: {new Date(order.updatedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}