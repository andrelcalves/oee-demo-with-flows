import { useCallback, useState } from 'react';

import { AtlasChatFab } from '@/components/chat/AtlasChatFab';
import { AtlasChatInput } from '@/components/chat/AtlasChatInput';
import {
  AtlasChatMessageList,
  type ChatMessageVm,
} from '@/components/chat/AtlasChatMessageList';
import { AtlasChatPanel } from '@/components/chat/AtlasChatPanel';
import { isAtlasConfigured } from '@/config/atlas';
import {
  useAtlasChatViewModel,
  type UseAtlasChatViewModelDeps,
} from '@/chat/useAtlasChatViewModel';

export type AtlasChatShellProps = {
  /** Test-only overrides forwarded to the view model. */
  viewModelDeps?: UseAtlasChatViewModelDeps;
};

/**
 * Shell entry point.
 *
 * Renders nothing when `VITE_ATLAS_AGENT_EXTERNAL_ID` is empty — that keeps
 * local dev and the unit tests free of an Atlas dependency. Once the env var
 * is set, the inner `AtlasBackedShell` mounts the FAB and the slide-over.
 */
export function AtlasChatShell({ viewModelDeps }: AtlasChatShellProps = {}) {
  if (!isAtlasConfigured()) {
    return null;
  }
  return <AtlasBackedShell viewModelDeps={viewModelDeps} />;
}

function AtlasBackedShell({ viewModelDeps }: AtlasChatShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const vm = useAtlasChatViewModel(viewModelDeps);

  const handleSend = useCallback(
    (text: string) => {
      void vm.send(text);
    },
    [vm],
  );

  const messages: ChatMessageVm[] = vm.messages.map((message) => ({
    id: message.id,
    role: message.role,
    text: message.text,
    isStreaming: message.isStreaming,
  }));

  return (
    <>
      <AtlasChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReset={vm.reset}
      >
        <AtlasChatMessageList
          messages={messages}
          suggestions={vm.suggestions}
          progress={vm.progress}
          error={vm.error}
          onSuggestionClick={handleSend}
        />
        <AtlasChatInput
          onSend={handleSend}
          onAbort={vm.abort}
          isStreaming={vm.isStreaming}
        />
      </AtlasChatPanel>
      <AtlasChatFab
        isOpen={isOpen}
        onToggle={() => setIsOpen((value) => !value)}
      />
    </>
  );
}
