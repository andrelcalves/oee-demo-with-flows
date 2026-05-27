import { formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { AreaSection } from '@/types/oee';

type AreaHealthPanelProps = {
  sections: AreaSection[];
  onEquipmentClick: (areaName: string, equipmentType: string) => void;
};

const EQUIPMENT_ROW_CLASS = cn(
  'flex w-full cursor-pointer flex-col rounded-lg px-2 py-2 text-left transition-colors',
  'hover:bg-[var(--oee-purple-100)]',
  'focus-visible:bg-[var(--oee-purple-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--oee-purple-300)]',
);

export function AreaHealthPanel({ sections, onEquipmentClick }: AreaHealthPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {sections.map((section) => (
        <div
          key={section.areaName}
          className="flex flex-col gap-2 rounded-lg p-2"
          style={{ background: 'var(--oee-column-bg)' }}
        >
          <h4 className="text-xs font-semibold leading-tight">{section.areaName}</h4>
          <ul className="flex flex-col gap-1">
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
