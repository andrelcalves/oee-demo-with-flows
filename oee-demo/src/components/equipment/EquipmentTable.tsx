import { PercentBar } from '@/components/oee/PercentBar';
import { OeeCard } from '@/components/oee/OeeCard';
import type { Equipment } from '@/types/oee';

type EquipmentTableProps = {
  equipment: Equipment[];
  onDetails: (equipmentId: string) => void;
};

function EquipmentDetailButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="oee-detail-btn rounded-full px-4 py-1.5 text-xs font-medium">
      Detail
    </button>
  );
}

export function EquipmentTable({ equipment, onDetails }: EquipmentTableProps) {
  return (
    <OeeCard className="overflow-hidden !p-0">
      <div className="border-b px-4 py-4" style={{ borderColor: 'var(--oee-card-border)' }}>
        <h2 className="text-lg font-semibold">Equipment list</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr
              className="text-foreground"
              style={{
                background: 'var(--oee-table-header-bg)',
                borderBottom: '1px solid var(--oee-card-border)',
              }}
            >
              <th className="px-4 py-3 font-medium">Equipment</th>
              <th className="px-4 py-3 font-medium">Operating Time</th>
              <th className="px-4 py-3 font-medium">MTBF</th>
              <th className="px-4 py-3 font-medium">Days Since Last Failure</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Overall Health</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {equipment.map((row) => (
              <tr
                key={row.equipmentId}
                style={{ borderBottom: '1px solid var(--oee-card-border)' }}
              >
                <td className="px-4 py-4 font-medium">{row.equipmentId}</td>
                <td className="px-4 py-4">{row.operatingTimeDays} days</td>
                <td className="px-4 py-4">{row.mtbfDays} days</td>
                <td className="px-4 py-4">{row.daysSinceLastFailure} days</td>
                <td className="px-4 py-4">
                  <PercentBar
                    value={row.availability}
                    label={`${row.equipmentId} availability`}
                    variant="equipment"
                    layout="inline"
                  />
                </td>
                <td className="px-4 py-4">
                  <PercentBar
                    value={row.overallHealth}
                    label={`${row.equipmentId} health`}
                    variant="equipment"
                    layout="inline"
                  />
                </td>
                <td className="px-4 py-4">
                  <EquipmentDetailButton
                    onClick={() => {
                      onDetails(row.equipmentId);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OeeCard>
  );
}
