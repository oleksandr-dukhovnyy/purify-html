// vite.config.js
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';

export default defineConfig({
  plugins: [
    dts({
      afterBuild() {
        // rename index.esm.d.ts to index.es.d.ts
        const target = './dist/index.esm.d.ts';
        const newName = './dist/index.es.d.ts';

        if (fs.existsSync(target)) {
          fs.renameSync(target, newName);
        }
      },
    }),
  ],

  build: {
    lib: {
      entry: './src/index.esm.ts',
      name: 'PurifyHTML',
      fileName: format => `index.${format}.js`,
    },
    sourcemap: true,
    target: 'es6',
    minify: true,
  },
});
