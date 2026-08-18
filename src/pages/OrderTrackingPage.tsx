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
import { Header } from "@components/layout/Header";
import { Link } from "react-router-dom";
import { ROUTES } from "@app/router";
import { User, MapPin, Phone, Clock } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ErrorMessage message="Invalid order ID" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ErrorMessage message="Order not found" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
        <Header />
        <PageContainer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <ErrorMessage message="Order not found" />
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50">
      <Header />
      <PageContainer title="Order Tracking">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <Link
              to={ROUTES.MENU}
              className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Menu
            </Link>
            <span className="text-xs px-4 py-2 rounded-full font-mono bg-amber-200 text-amber-800 font-semibold">
              Order #{order.id.slice(0, 8)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <OrderTracker status={order.status} />

              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Name</p>
                      <p className="text-base text-amber-900 font-medium">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Address</p>
                      <p className="text-base text-amber-900 font-medium">{order.customer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Phone</p>
                      <p className="text-base text-amber-900 font-medium">{order.customer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 space-y-6">
              <OrderSummary items={order.items} total={order.totalAmount} />

              <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Order Timeline
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 pb-3 border-b border-amber-100">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Order Placed</p>
                      <p className="text-amber-900">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {order.updatedAt !== order.createdAt && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold">Last Updated</p>
                        <p className="text-amber-900">{new Date(order.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}