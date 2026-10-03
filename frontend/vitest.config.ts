import { defineConfig } from 'vitest/config'

/** Unit tests only (pure libs) — no React plugin to avoid Vite 8 / Vitest peer clash. */
export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
    clearMocks: true,
  },
})
