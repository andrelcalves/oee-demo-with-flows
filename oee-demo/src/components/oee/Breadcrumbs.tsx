import { Button } from '@cognite/aura/components';

type Crumb = {
  label: string;
  onClick?: () => void;
};

type BreadcrumbsProps = {
  crumbs: Crumb[];
};

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {crumb.onClick && !isLast ? (
              <Button variant="ghost" className="h-auto p-0 text-sm" onClick={crumb.onClick}>
                {crumb.label}
              </Button>
            ) : (
              <span className={isLast ? 'text-foreground font-medium' : undefined}>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
