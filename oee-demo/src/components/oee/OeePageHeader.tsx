import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/oee/Breadcrumbs';
import { ThemeToggle } from '@/components/oee/ThemeToggle';
import { StatusWidget } from '@/components/oee/StatusWidget';

type Crumb = { label: string; onClick?: () => void };

type OeePageHeaderProps = {
  title: string;
  crumbs: Crumb[];
  showStatusWidget?: boolean;
  actions?: ReactNode;
};

export function OeePageHeader({
  title,
  crumbs,
  showStatusWidget = false,
  actions,
}: OeePageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-wide md:text-2xl">{title}</h1>
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {showStatusWidget ? <StatusWidget /> : null}
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
