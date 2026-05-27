import { Card, CardContent, CardHeader, CardTitle } from '@cognite/aura/components';

import { cn } from '@/lib/utils';

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  highlight?: 'warning' | 'default';
};

export function KpiCard({ title, value, subtitle, highlight = 'default' }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            'text-2xl font-semibold',
            highlight === 'warning' && 'text-destructive'
          )}
        >
          {value}
        </p>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  belowTarget?: boolean;
};

export function SummaryCard({ title, value, belowTarget = false }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn('text-xl font-semibold', belowTarget && 'text-destructive')}>{value}</p>
      </CardContent>
    </Card>
  );
}
