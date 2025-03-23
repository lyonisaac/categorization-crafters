import React from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Categorization Crafters
          </h1>
          {title && (
            <p className="mt-2 text-sm text-gray-600">
              {title}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
