import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type OeeCardProps = {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md';
  style?: CSSProperties;
};

export function OeeCard({ children, className, padding = 'md', style }: OeeCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        padding === 'sm' ? 'p-3' : 'p-4',
        className,
      )}
      style={{
        background: 'var(--oee-card-bg)',
        border: '1px solid var(--oee-card-border)',
        boxShadow: 'var(--oee-card-shadow)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
