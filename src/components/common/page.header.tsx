'use client';

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHeader({ title, description, icon, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-10">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3 md:mb-6 overflow-x-auto scrollbar-hide">
          <Breadcrumb>
            <BreadcrumbList className="text-xs md:text-sm flex-nowrap min-w-max">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="shrink-0">
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </BreadcrumbSeparator>
                  )}
                  <BreadcrumbItem className="shrink-0">
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="font-medium whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        href={item.href || '#'}
                        className="transition-colors hover:text-foreground whitespace-nowrap"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Title Section */}
      <div className={`flex items-center ${icon ? 'gap-3 md:gap-4' : ''}`}>
        {icon && <span className="text-3xl md:text-5xl shrink-0">{icon}</span>}
        <div className="flex-1 min-w-0">
          <h1 
            className="text-xl md:text-2xl lg:text-4xl font-bold tracking-tight mb-1 md:mb-2 wrap-break-word" 
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h1>
          {description && (
            <p 
              className="text-sm md:text-base" 
              style={{ color: 'var(--muted-foreground)' }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div className="mt-4 md:mt-6 h-px" style={{ backgroundColor: 'var(--border)' }} />
    </div>
  );
}
