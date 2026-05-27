import { OeeCard } from '@/components/oee/OeeCard';
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
    <OeeCard className="flex flex-col items-center justify-center gap-1 py-3">
      {isHero ? <p className={titleSize}>{title}</p> : null}
      <OeeGauge
        value={value}
        variant={variant}
        size={isHero ? 'lg' : 'md'}
        arc={isHero ? 'semicircle' : 'full'}
        ariaLabel={title}
      />
      {isHero ? null : <p className={titleSize}>{title}</p>}
    </OeeCard>
  );
}
