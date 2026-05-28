import { formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AreaSection } from '@/types/oee';

type AreaHealthPanelProps = {
  sections: AreaSection[];
  onEquipmentClick: (areaName: string, equipmentType: string) => void;
  fillHeight?: boolean;
};

const EQUIPMENT_ROW_CLASS = cn(
  'flex w-full cursor-pointer flex-col rounded-lg px-2 py-2 text-left transition-colors',
  'hover:bg-[var(--oee-purple-100)]',
  'focus-visible:bg-[var(--oee-purple-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--oee-purple-300)]',
);

export function AreaHealthPanel({
  sections,
  onEquipmentClick,
  fillHeight = false,
}: AreaHealthPanelProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-3',
        fillHeight && 'h-full min-h-0 flex-1',
      )}
    >
      {sections.map((section) => (
        <div
          key={section.areaName}
          className={cn(
            'flex flex-col gap-2 rounded-lg p-2',
            fillHeight && 'h-full',
          )}
          style={{ background: 'var(--oee-column-bg)' }}
        >
          <h4 className="text-xs font-semibold leading-tight">{section.areaName}</h4>
          <ul
            className={cn(
              fillHeight ? 'flex flex-1 flex-col justify-between gap-1' : 'flex flex-col gap-1',
            )}
          >
            {section.equipment.map((item) => (
              <li key={`${section.areaName}-${item.equipmentType}`}>
                <button
                  type="button"
                  onClick={() => {
                    onEquipmentClick(section.areaName, item.equipmentType);
                  }}
                  className={EQUIPMENT_ROW_CLASS}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs">{item.equipmentType}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.availableCount}/{item.totalCount}
                    </span>
                  </div>
                  <span className="text-xl font-semibold leading-tight">
                    {formatPercent(item.availability)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
