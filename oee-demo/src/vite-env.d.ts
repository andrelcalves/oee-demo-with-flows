/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ATLAS_AGENT_EXTERNAL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
