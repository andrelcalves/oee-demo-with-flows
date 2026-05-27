import type { ProductionLoss } from '@/types/oee';

type LossBarProps = {
  losses: ProductionLoss[];
  maxValue?: number;
};

const BAR_COLORS = [
  'var(--oee-pink)',
  'var(--oee-purple-500)',
  'var(--oee-purple-300)',
  'var(--oee-blue)',
  'var(--oee-track)',
];

export function LossBar({ losses, maxValue }: LossBarProps) {
  const computedMax = maxValue ?? Math.max(...losses.map((loss) => loss.value), 1);

  return (
    <ul className="flex flex-col gap-2" aria-label="Production loss categories">
      {losses.map((loss, index) => {
        const widthPercent = computedMax > 0 ? (loss.value / computedMax) * 100 : 0;
        const color = BAR_COLORS[index % BAR_COLORS.length];
        return (
          <li
            key={loss.category}
            className="grid grid-cols-[1fr_2fr_auto] items-center gap-2 text-xs"
          >
            <span className="truncate">{loss.category}</span>
            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--oee-track)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${widthPercent}%`, background: color }}
                role="meter"
                aria-valuenow={loss.value}
                aria-valuemin={0}
                aria-valuemax={computedMax}
                aria-label={loss.category}
              />
            </div>
            <span className="text-right text-xs font-semibold tabular-nums">{loss.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
