import { Alert, AlertDescription, Loader } from '@cognite/aura/components';

import { EquipmentTable } from '@/components/equipment/EquipmentTable';
import { OeePageHeader } from '@/components/oee/OeePageHeader';
import { useAppState } from '@/state/AppStateProvider';
import { useEquipmentListViewModel } from '@/view-models/useEquipmentListViewModel';

export function EquipmentListPage() {
  const { state, navigateToDashboard, navigateToEquipmentDetails } = useAppState();
  const areaName = state.areaName ?? 'Pre Reaction';
  const equipmentType = state.equipmentType ?? 'Turbine';
  const vm = useEquipmentListViewModel(areaName, equipmentType);

  const listLabel = equipmentType === 'Turbine' ? 'Equipment' : `${areaName} / ${equipmentType}`;

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
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 p-4 md:p-6">
      <OeePageHeader
        title={`OEE MONITOR / ${listLabel}`}
        crumbs={[
          { label: 'Home' },
          { label: 'Oee Monitor', onClick: () => void navigateToDashboard() },
          { label: listLabel },
        ]}
      />

      <EquipmentTable
        equipment={vm.equipment}
        onDetails={(equipmentId) => {
          void navigateToEquipmentDetails(equipmentId);
        }}
      />
    </div>
  );
}
