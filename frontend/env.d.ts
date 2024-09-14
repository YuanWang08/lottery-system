/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
  // 更多環境變數...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
