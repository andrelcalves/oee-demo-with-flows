/**
 * Atlas AI configuration.
 *
 * Set `VITE_ATLAS_AGENT_EXTERNAL_ID` in `.env` to enable the in-app chat assistant.
 * When this value is empty the chat FAB is hidden, which keeps local development
 * (and the unit tests) simple — no extra setup is required to run the demo.
 */

export const ATLAS_AGENT_EXTERNAL_ID: string =
  import.meta.env.VITE_ATLAS_AGENT_EXTERNAL_ID ?? '';

export function isAtlasConfigured(): boolean {
  return ATLAS_AGENT_EXTERNAL_ID.trim().length > 0;
}
