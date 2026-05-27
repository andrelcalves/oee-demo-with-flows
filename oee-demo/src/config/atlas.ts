/**
 * Atlas AI configuration.
 *
 * The chat FAB is always visible. Set `VITE_ATLAS_AGENT_EXTERNAL_ID` in `.env` to
 * enable live Atlas chat; when empty, the app shows a preview panel instead.
 */

export const ATLAS_AGENT_EXTERNAL_ID: string =
  import.meta.env.VITE_ATLAS_AGENT_EXTERNAL_ID ?? '';

export function isAtlasConfigured(): boolean {
  return ATLAS_AGENT_EXTERNAL_ID.trim().length > 0;
}
