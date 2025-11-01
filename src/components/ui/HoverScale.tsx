"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  scale = 1.05,
  duration = 200,
  className = ''
}) => {
  return (
    <div
      className={cn(
        'transition-transform cursor-pointer',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
};