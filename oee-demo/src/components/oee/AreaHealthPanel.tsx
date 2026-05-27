import { formatPercent } from '@/lib/format';
import type { AreaSection } from '@/types/oee';

type AreaHealthPanelProps = {
  sections: AreaSection[];
  onEquipmentClick: (areaName: string, equipmentType: string) => void;
};

export function AreaHealthPanel({ sections, onEquipmentClick }: AreaHealthPanelProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {sections.map((section) => (
        <div key={section.areaName} className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold leading-tight">{section.areaName}</h4>
          <ul className="flex flex-col gap-2">
            {section.equipment.map((item) => (
              <li key={`${section.areaName}-${item.equipmentType}`}>
                <button
                  type="button"
                  onClick={() => {
                    onEquipmentClick(section.areaName, item.equipmentType);
                  }}
                  className="group flex w-full flex-col rounded-md text-left transition-colors hover:bg-muted/60"
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
