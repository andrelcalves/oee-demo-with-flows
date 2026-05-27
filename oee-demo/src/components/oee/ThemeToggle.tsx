import { Button } from '@cognite/aura/components';
import { IconMoon, IconSun } from '@tabler/icons-react';

import { useAppState } from '@/state/AppStateProvider';

export function ThemeToggle() {
  const { state, toggleTheme } = useAppState();
  const isDark = state.theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => {
        void toggleTheme();
      }}
    >
      {isDark ? <IconSun size={18} aria-hidden /> : <IconMoon size={18} aria-hidden />}
    </Button>
  );
}
