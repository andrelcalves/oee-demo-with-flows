import { OeeGauge } from '@/components/oee/OeeGauge';

type GaugeVariant = 'hero' | 'availability' | 'performance' | 'quality';

type KpiGaugeCardProps = {
  title: string;
  value: number;
  variant: GaugeVariant;
};

export function KpiGaugeCard({ title, value, variant }: KpiGaugeCardProps) {
  const isHero = variant === 'hero';
  const titleSize = isHero ? 'text-base font-medium' : 'text-sm font-medium';

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-card p-4 shadow-sm">
      {isHero ? <p className={titleSize}>{title}</p> : null}
      <OeeGauge value={value} variant={variant} size={isHero ? 'lg' : 'md'} ariaLabel={title} />
      {isHero ? null : <p className={titleSize}>{title}</p>}
    </div>
  );
}
