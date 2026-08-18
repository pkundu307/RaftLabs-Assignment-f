import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            {subtitle && (
              <p className="text-amber-700 text-sm mb-2">{subtitle}</p>
            )}
            <h1 className="text-4xl font-bold text-amber-900 tracking-tight">
              {title}
            </h1>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
