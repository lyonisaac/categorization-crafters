import React from 'react';
import { Button } from './button';
import { Card } from './card';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {actions && (
          <div className="mt-4 md:mt-0 flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
}
