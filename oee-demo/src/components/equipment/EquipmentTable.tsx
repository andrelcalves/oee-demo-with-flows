import { Button, Card, CardContent } from '@cognite/aura/components';

import { PercentBar } from '@/components/oee/PercentBar';
import type { Equipment } from '@/types/oee';

type EquipmentTableProps = {
  equipment: Equipment[];
  onDetails: (equipmentId: string) => void;
};

export function EquipmentTable({ equipment, onDetails }: EquipmentTableProps) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 font-medium">Equipment</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Availability</th>
              <th className="px-4 py-3 font-medium">Quality</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((row) => (
              <tr key={row.equipmentId} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{row.equipmentId}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.description}</td>
                <td className="px-4 py-3">
                  <PercentBar value={row.availability} label={`${row.equipmentId} availability`} />
                </td>
                <td className="px-4 py-3">
                  <PercentBar value={row.quality} label={`${row.equipmentId} quality`} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDetails(row.equipmentId);
                    }}
                  >
                    DETAILS
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
