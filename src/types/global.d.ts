// src/types/global.d.ts
export {}

declare global {
  interface Window {
    APP_CONFIG: {
      BASE_API: string
    }
  }
}