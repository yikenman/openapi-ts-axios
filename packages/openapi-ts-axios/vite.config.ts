import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts', 'src/**/*.spec.ts'],
    environment: 'node',
    globals: true,
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.json'
    },
    restoreMocks: true,
    clearMocks: true,
    passWithNoTests: true,
    coverage: {
      provider: 'istanbul'
    }
  }
});
