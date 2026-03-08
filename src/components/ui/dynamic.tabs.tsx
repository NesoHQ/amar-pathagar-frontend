'use client';


import { useState, useRef, useEffect, ReactNode } from 'react';
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
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabChange = (value: string, index: number) => {
    setActiveTab(value);
    onTabChange?.(value);
    updateIndicator(index);
  };

  const updateIndicator = (index: number) => {
    const tab = tabRefs.current[index];
    if (tab) {
      setIndicatorStyle({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });
    }
  };

  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.value === defaultValue);
    if (activeIndex !== -1) {
      updateIndicator(activeIndex);
    }
  }, [defaultValue, tabs]);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List Container */}
      <div className="relative mb-6">
        {/* Background Card */}
        <div 
          className="rounded-lg p-0.5 md:p-1"
          style={{ 
            backgroundColor: 'var(--muted)',
            border: '1px solid var(--border)'
          }}
        >
          {/* Mobile: 2 column grid */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab.value}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  onClick={() => !tab.disabled && handleTabChange(tab.value, index)}
                  disabled={tab.disabled}
                  className={`
                    relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                    font-medium text-sm transition-all duration-300
                    ${activeTab === tab.value
                      ? 'text-(--primary-foreground)'
                      : 'text-(--muted-foreground) hover:text-(--foreground)'
                    }
                    ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{
                    zIndex: activeTab === tab.value ? 2 : 1,
                  }}
                >
                  {/* Active background */}
                  {activeTab === tab.value && (
                    <div 
                      className="absolute inset-0 rounded-lg shadow-md"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        animation: 'scaleIn 0.2s ease-out'
                      }}
                    />
                  )}
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon && (
                      <span className={`text-base transition-transform duration-300 ${
                        activeTab === tab.value ? 'scale-110' : 'scale-100'
                      }`}>
                        {tab.icon}
                      </span>
                    )}
                    <span className="font-semibold">{tab.label}</span>
                    {tab.count !== undefined && (
                      <Badge 
                        className={`
                          text-xs px-2 py-0 h-5 min-w-[24px] font-bold
                          transition-all duration-300
                          ${activeTab === tab.value 
                            ? 'bg-(--primary-foreground) text-(--primary) border-0' 
                            : 'bg-(--background) text-(--foreground) border border-(--border)'
                          }
                        `}
                      >
                        {tab.count}
                      </Badge>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Ultra-minimal compact design */}
          <div className="hidden md:block">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
              {tabs.map((tab, index) => (
                <button
                  key={tab.value}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  onClick={() => !tab.disabled && handleTabChange(tab.value, index)}
                  disabled={tab.disabled}
                  className={`
                    relative flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                    font-medium text-xs transition-all duration-300
                    ${activeTab === tab.value
                      ? 'text-(--primary-foreground)'
                      : 'text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--background)/30'
                    }
                    ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  style={{
                    zIndex: activeTab === tab.value ? 2 : 1,
                  }}
                >
                  {/* Active background */}
                  {activeTab === tab.value && (
                    <div 
                      className="absolute inset-0 rounded-lg shadow-sm"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        animation: 'scaleIn 0.2s ease-out'
                      }}
                    />
                  )}
                  
                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.icon && (
                      <span className={`text-sm transition-all duration-300 ${
                        activeTab === tab.value ? 'scale-105' : 'scale-100'
                      }`}>
                        {tab.icon}
                      </span>
                    )}
                    <span className="font-semibold">{tab.label}</span>
                    {tab.count !== undefined && (
                      <Badge 
                        className={`
                          text-[10px] px-1.5 py-0 h-4 min-w-[20px] font-bold
                          transition-all duration-300
                          ${activeTab === tab.value 
                            ? 'bg-(--primary-foreground) text-(--primary) border-0' 
                            : 'bg-(--background) text-(--foreground) border border-(--border)'
                          }
                        `}
                      >
                        {tab.count}
                      </Badge>
                    )}
                  </span>

                  {/* Subtle hover effect */}
                  {activeTab !== tab.value && !tab.disabled && (
                    <div 
                      className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
                      style={{ 
                        backgroundColor: 'var(--background)',
                        opacity: 0.3
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content with smooth fade and slide animation */}
      <div 
        key={activeTab}
        className="animate-fadeSlideIn"
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
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
