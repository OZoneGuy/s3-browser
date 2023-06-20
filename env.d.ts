/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_SECRET_ID: string
  readonly VITE_AWS_SECRET_KEY: string
  readonly VITE_AWS_BUCKET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
