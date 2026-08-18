import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {title && (
          <div className="mb-6 sm:mb-8">
            {subtitle && (
              <p className="text-amber-700 text-sm font-semibold uppercase tracking-wide mb-2">
                {subtitle}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 tracking-tight">
              {title}
            </h1>
            <div className="mt-3 sm:mt-4 w-20 sm:w-24 h-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-full" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
