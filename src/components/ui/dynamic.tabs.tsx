'use client';

/**
 * DynamicTabs Component
 * 
 * A reusable, sophisticated tabs component with mobile-first design.
 * Features:
 * - Responsive design (horizontal scroll on mobile, full width on desktop)
 * - Badge support for counts
 * - Icon support
 * - Active state indicators
 * - Theme-aware styling
 * 
 * Usage:
 * ```tsx
 * <DynamicTabs
 *   defaultValue="tab1"
 *   tabs={[
 *     { value: 'tab1', label: 'Tab 1', count: 5, icon: '📝' },
 *     { value: 'tab2', label: 'Tab 2', count: 10 }
 *   ]}
 * >
 *   <DynamicTabContent value="tab1">Content 1</DynamicTabContent>
 *   <DynamicTabContent value="tab2">Content 2</DynamicTabContent>
 * </DynamicTabs>
 * ```
 */

import { useState, ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface Tab {
  value: string;
  label: string;
  count?: number;
  icon?: string;
  disabled?: boolean;
}

interface DynamicTabsProps {
  defaultValue: string;
  tabs: Tab[];
  children: ReactNode;
  className?: string;
  onTabChange?: (value: string) => void;
}

interface DynamicTabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function DynamicTabs({ 
  defaultValue, 
  tabs, 
  children, 
  className = '',
  onTabChange 
}: DynamicTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div className="relative mb-6">
        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max px-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => !tab.disabled && handleTabChange(tab.value)}
                disabled={tab.disabled}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.value
                    ? 'shadow-md'
                    : 'hover:shadow-sm'
                  }
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  backgroundColor: activeTab === tab.value ? 'var(--primary)' : 'var(--card)',
                  color: activeTab === tab.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: activeTab === tab.value ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {tab.icon && <span className="text-base">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Badge 
                    variant={activeTab === tab.value ? 'secondary' : 'outline'}
                    className="text-xs px-1.5 py-0 h-5 min-w-[20px]"
                  >
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Full width grid */}
        <div className="hidden md:grid gap-2" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => !tab.disabled && handleTabChange(tab.value)}
              disabled={tab.disabled}
              className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm
                transition-all duration-200 relative
                ${activeTab === tab.value
                  ? 'shadow-md'
                  : 'hover:shadow-sm'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                backgroundColor: activeTab === tab.value ? 'var(--primary)' : 'var(--card)',
                color: activeTab === tab.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: activeTab === tab.value ? 'var(--primary)' : 'var(--border)',
              }}
            >
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge 
                  variant={activeTab === tab.value ? 'secondary' : 'outline'}
                  className="text-xs px-2 py-0 h-5 min-w-[24px]"
                >
                  {tab.count}
                </Badge>
              )}
              {/* Active indicator */}
              {activeTab === tab.value && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                  style={{ backgroundColor: 'var(--primary-foreground)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {children}
      </div>
    </div>
  );
}

export function DynamicTabContent({ value, children, className = '' }: DynamicTabContentProps) {
  return (
    <div data-tab-value={value} className={className}>
      {children}
    </div>
  );
}

// Hook to get active tab from parent
export function useDynamicTabs(defaultValue: string) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return { activeTab, setActiveTab };
}
