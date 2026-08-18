import { OrderStatus } from "../types";

interface OrderTrackerProps {
  status: OrderStatus;
}

const steps = [
  { status: "ORDER_RECEIVED", label: "Order Received" },
  { status: "PREPARING", label: "Preparing" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED", label: "Delivered" },
] as const;

export function OrderTracker({ status }: OrderTrackerProps) {
  const getStatusIndex = () => {
    return steps.findIndex((s) => s.status === status);
  };

  const currentIndex = getStatusIndex();

  return (
    <div className="bg-gradient-to-br from-amber-50 to-white p-6 rounded-2xl shadow-md border border-amber-200">
      <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Order Status
      </h3>
      <div className="relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.status} className="flex items-start gap-4 py-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg"
                      : isCurrent
                      ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg ring-4 ring-amber-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 mt-1 ${
                      isCompleted ? "bg-gradient-to-b from-amber-500 to-amber-300" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-3">
                <p
                  className={`font-semibold text-base ${
                    isCurrent || isCompleted ? "text-amber-900" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full">
                    In Progress
                  </span>
                )}
                {isCompleted && (
                  <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
