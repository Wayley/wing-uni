import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { readdirSync } from 'node:fs';
import { dts } from 'rollup-plugin-dts';

const packages = readdirSync('packages');

let config = [];

packages.map((pkg) => {
  const input = `packages/${pkg}/src/index.ts`;
  config.push(
    {
      input,
      output: [{ file: `packages/${pkg}/dist/index.d.ts`, format: 'es' }],
      plugins: [dts()],
    },
    {
      input,
      output: [{ file: `packages/${pkg}/dist/index.es.js`, format: 'es' }],
      plugins: [terser(), typescript()],
    },
    {
      input,
      output: [{ file: `packages/${pkg}/dist/index.cjs.js`, format: 'cjs' }],
      plugins: [terser(), typescript()],
    },
    {
      input,
      output: [{ file: `packages/${pkg}/dist/index.umd.js`, format: 'umd', name: pkg.replaceAll(/-|\./g, '_') }],
      plugins: [terser(), typescript()],
    }
  );
});
export default config;
