import type { AppState } from '@/types/oee';
import { DEFAULT_APP_STATE } from '@/types/oee';

export function parseAppState(initialState: string | undefined): AppState {
  if (!initialState) {
    return DEFAULT_APP_STATE;
  }
  try {
    const parsed: unknown = JSON.parse(initialState);
    if (!isAppState(parsed)) {
      return DEFAULT_APP_STATE;
    }
    return parsed;
  } catch {
    return DEFAULT_APP_STATE;
  }
}

function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  const validPages = ['dashboard', 'equipment-list', 'equipment-details'];
  const validThemes = ['light', 'dark'];
  return (
    typeof record.page === 'string' &&
    validPages.includes(record.page) &&
    typeof record.theme === 'string' &&
    validThemes.includes(record.theme)
  );
}

export function applyThemeClass(theme: AppState['theme']): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
