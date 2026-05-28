import { LossBar } from '@/components/oee/LossBar';
import { OeeCard } from '@/components/oee/OeeCard';
import type { ProductionLoss } from '@/types/oee';

type MonthlyLossCardProps = {
  losses: ProductionLoss[];
};

export function MonthlyLossCard({ losses }: MonthlyLossCardProps) {
  return (
    <OeeCard>
      <p className="mb-3 text-xs font-medium text-muted-foreground">Monthly Production Loss</p>
      <LossBar losses={losses} />
    </OeeCard>
  );
}
