/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_BOT_TOKEN: string;
  readonly VITE_TELEGRAM_CHAT_IDS: string;
  readonly VITE_ADMIN_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
