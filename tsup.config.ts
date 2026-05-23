import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  splitting: false,
  shims: true,
});
