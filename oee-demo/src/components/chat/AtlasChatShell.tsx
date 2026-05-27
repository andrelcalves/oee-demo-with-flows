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
  ATLAS_CHAT_SUGGESTIONS,
  useAtlasChatViewModel,
  type UseAtlasChatViewModelDeps,
} from '@/chat/useAtlasChatViewModel';

export type AtlasChatShellProps = {
  /** Test-only overrides forwarded to the view model. */
  viewModelDeps?: UseAtlasChatViewModelDeps;
};

const PREVIEW_WELCOME_MESSAGE: ChatMessageVm = {
  id: 'atlas-preview-welcome',
  role: 'assistant',
  text:
    'Atlas AI will answer questions about overall OEE, equipment health, production trends, and production losses for this nitric-acid plant. Set VITE_ATLAS_AGENT_EXTERNAL_ID in .env to enable live chat.',
};

/**
 * Shell entry point.
 *
 * Always renders the chat FAB. When Atlas is not configured, shows a preview
 * panel with static copy and a disabled input for demos.
 */
export function AtlasChatShell({ viewModelDeps }: AtlasChatShellProps = {}) {
  if (isAtlasConfigured()) {
    return <AtlasBackedShell viewModelDeps={viewModelDeps} />;
  }
  return <AtlasPreviewShell />;
}

function AtlasPreviewShell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AtlasChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        subtitle="Preview — connect Atlas to chat"
      >
        <AtlasChatMessageList
          messages={[PREVIEW_WELCOME_MESSAGE]}
          suggestions={ATLAS_CHAT_SUGGESTIONS}
          suggestionsDisabled
        />
        <AtlasChatInput
          onSend={() => undefined}
          disabled
          placeholder="Configure Atlas to enable chat"
        />
      </AtlasChatPanel>
      <AtlasChatFab
        isOpen={isOpen}
        onToggle={() => setIsOpen((value) => !value)}
      />
    </>
  );
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
