import { Alert, AlertDescription, Loader } from '@cognite/aura/components';

import { Breadcrumbs } from '@/components/oee/Breadcrumbs';
import { ThemeToggle } from '@/components/oee/ThemeToggle';
import { EquipmentTable } from '@/components/equipment/EquipmentTable';
import { useAppState } from '@/state/AppStateProvider';
import { useEquipmentListViewModel } from '@/view-models/useEquipmentListViewModel';

export function EquipmentListPage() {
  const { state, navigateToDashboard, navigateToEquipmentDetails } = useAppState();
  const areaName = state.areaName ?? '';
  const equipmentType = state.equipmentType ?? '';
  const vm = useEquipmentListViewModel(areaName, equipmentType);

  const title = `${areaName} / ${equipmentType}`;

  if (vm.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader size={24} />
      </div>
    );
  }

  if (vm.isError) {
    return (
      <Alert>
        <AlertDescription>Failed to load equipment list.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-wide">OEE MONITOR - {title}</h1>
          <Breadcrumbs
            crumbs={[
              { label: 'Home' },
              { label: 'Oee Monitor', onClick: () => void navigateToDashboard() },
              { label: title },
            ]}
          />
        </div>
        <ThemeToggle />
      </header>

      <EquipmentTable
        equipment={vm.equipment}
        onDetails={(equipmentId) => {
          void navigateToEquipmentDetails(equipmentId);
        }}
      />
    </div>
  );
}
