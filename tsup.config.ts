import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom', '@tiptap/react'],
  sourcemap: true,
  clean: true,
  // Use esbuildOptions to configure JSX
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
});
