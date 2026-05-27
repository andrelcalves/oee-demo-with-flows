import type { ProductionLoss } from '@/types/oee';
import { formatLossTons } from '@/lib/format';

type LossBarProps = {
  losses: ProductionLoss[];
  maxValue?: number;
};

export function LossBar({ losses, maxValue }: LossBarProps) {
  const computedMax = maxValue ?? Math.max(...losses.map((l) => l.value), 1);

  return (
    <ul className="flex flex-col gap-3" aria-label="Production loss categories">
      {losses.map((loss) => {
        const widthPercent = (loss.value / computedMax) * 100;
        return (
          <li key={loss.category} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span>{loss.category}</span>
              <span className="text-muted-foreground">{formatLossTons(loss.value)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${widthPercent}%` }}
                role="meter"
                aria-valuenow={loss.value}
                aria-valuemin={0}
                aria-valuemax={computedMax}
                aria-label={loss.category}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
