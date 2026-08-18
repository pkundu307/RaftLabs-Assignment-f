import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="pb-12 sm:pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {title && (
          <div className="mb-6 sm:mb-8 lg:mb-10">
            {subtitle && (
              <p className="text-amber-700 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2">
                {subtitle}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-amber-950 tracking-tight">
              {title}
            </h1>
            <div className="mt-3 sm:mt-4 w-16 sm:w-20 lg:w-24 h-1.5 sm:h-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-full shadow-sm" />
          </div>
        )}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-amber-100">
          {children}
        </div>
      </div>
    </div>
  );
}
