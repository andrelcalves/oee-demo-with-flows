import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, Button, Card, CardContent, CardHeader, CardTitle, Loader } from '@cognite/aura/components';

import { Breadcrumbs } from '@/components/oee/Breadcrumbs';
import { ThemeToggle } from '@/components/oee/ThemeToggle';
import { formatPercent } from '@/lib/format';
import { useOeeMetricsService } from '@/services/OeeMetricsServiceContext';
import { useAppState } from '@/state/AppStateProvider';

export function EquipmentDetailsPage() {
  const { state, navigateToDashboard, navigateToEquipmentList } = useAppState();
  const service = useOeeMetricsService();
  const equipmentId = state.equipmentId ?? '';

  const query = useQuery({
    queryKey: ['oee', 'equipment-detail', equipmentId],
    queryFn: () => service.getEquipmentById(equipmentId),
    enabled: Boolean(equipmentId),
  });

  const areaName = state.areaName ?? '';
  const equipmentType = state.equipmentType ?? '';
  const listLabel = areaName && equipmentType ? `${areaName} / ${equipmentType}` : 'Equipment';

  if (query.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader size={24} />
      </div>
    );
  }

  const equipment = query.data;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-wide">Equipment Details</h1>
          <Breadcrumbs
            crumbs={[
              { label: 'Home' },
              { label: 'Oee Monitor', onClick: () => void navigateToDashboard() },
              {
                label: listLabel,
                onClick: () => {
                  if (areaName && equipmentType) {
                    void navigateToEquipmentList(areaName, equipmentType);
                  }
                },
              },
              { label: equipmentId },
            ]}
          />
        </div>
        <ThemeToggle />
      </header>

      {!equipment ? (
        <Alert>
          <AlertDescription>Equipment not found.</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{equipment.equipmentId}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <p>{equipment.description}</p>
            <p>
              <span className="text-muted-foreground">Area:</span> {equipment.areaName}
            </p>
            <p>
              <span className="text-muted-foreground">Type:</span> {equipment.equipmentType}
            </p>
            <p>
              <span className="text-muted-foreground">Availability:</span>{' '}
              {formatPercent(equipment.availability)}
            </p>
            <p>
              <span className="text-muted-foreground">Quality:</span> {formatPercent(equipment.quality)}
            </p>
            <p className="text-muted-foreground">
              Detailed historian views and maintenance history will be added when CDF integration
              is available.
            </p>
          </CardContent>
        </Card>
      )}

      {areaName && equipmentType ? (
        <Button
          variant="outline"
          onClick={() => {
            void navigateToEquipmentList(areaName, equipmentType);
          }}
        >
          Back to list
        </Button>
      ) : null}
    </div>
  );
}
