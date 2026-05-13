/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_API_BASE_URL?: string;
  readonly VITE_GITHUB_API_VERSION?: string;
  readonly VITE_GITHUB_TOKEN?: string;
  readonly VITE_CHAT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
