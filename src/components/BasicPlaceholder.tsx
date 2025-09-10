import React from 'react';

interface BasicPlaceholderProps {
  title: string;
  icon: React.ComponentType<any>;
}

export const BasicPlaceholder: React.FC<BasicPlaceholderProps> = ({ title, icon: Icon }) => (
  <div className="h-full bg-surface-0 flex items-center justify-center p-4">
    <div className="text-center space-y-3">
      <Icon className="w-12 h-12 text-teal-500 mx-auto" />
      <div>
        <div className="text-text-1 text-sm mb-1 tracking-wider">
          {title}
        </div>
        <div className="text-text-3 text-xs mono tracking-wide">
          System Ready
        </div>
      </div>
    </div>
  </div>
);