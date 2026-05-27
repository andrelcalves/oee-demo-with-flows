import { Button, Card, CardContent, CardHeader, CardTitle } from '@cognite/aura/components';

import { PercentBar } from '@/components/oee/PercentBar';
import type { Equipment } from '@/types/oee';

type EquipmentTableProps = {
  equipment: Equipment[];
  onDetails: (equipmentId: string) => void;
};

export function EquipmentTable({ equipment, onDetails }: EquipmentTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Equipment list</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground">
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
              <tr key={row.equipmentId} className="border-b border-border last:border-0">
                <td className="px-4 py-4 font-medium">{row.equipmentId}</td>
                <td className="px-4 py-4">{row.operatingTimeDays} days</td>
                <td className="px-4 py-4">{row.mtbfDays} days</td>
                <td className="px-4 py-4">{row.daysSinceLastFailure} days</td>
                <td className="px-4 py-4">
                  <PercentBar value={row.availability} label={`${row.equipmentId} availability`} />
                </td>
                <td className="px-4 py-4">
                  <PercentBar value={row.overallHealth} label={`${row.equipmentId} health`} />
                </td>
                <td className="px-4 py-4">
                  <Button
                    className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                    size="sm"
                    onClick={() => {
                      onDetails(row.equipmentId);
                    }}
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
