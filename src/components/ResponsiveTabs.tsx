import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface ResponsiveTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  minWidthForText?: number; // Minimum width to show text labels
  className?: string;
}

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  minWidthForText = 200,
  className = ""
}) => {
  const [showText, setShowText] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor parent container width to determine if we should show text
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current?.parentElement) {
        const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
        const shouldShowText = parentWidth >= minWidthForText;
        setShowText(shouldShowText);
      }
    };

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    updateWidth();

    return () => {
      observer.disconnect();
    };
  }, [minWidthForText]);

  return (
    <TooltipProvider>
      <div 
        ref={containerRef}
        className={`bg-surface-1 border border-border rounded-md overflow-hidden ${className}`}
      >
        <div className="flex">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            const buttonContent = (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-2 text-xs tracking-wide flex items-center justify-center gap-1 hover-transition ${
                  index > 0 ? 'border-l border-border' : ''
                } ${
                  isActive
                    ? 'bg-violet-500 text-bg-canvas'
                    : 'text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:bg-opacity-20'
                } ${!showText ? 'min-w-[36px]' : ''}`}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                {showText && (
                  <span className="whitespace-nowrap">{tab.label}</span>
                )}
              </button>
            );

            // If text is hidden due to small width, wrap in tooltip
            if (!showText) {
              return (
                <Tooltip key={tab.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="bg-surface-0 border-border text-text-1 px-2 py-1 text-xs"
                  >
                    {tab.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};