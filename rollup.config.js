// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { minify } from 'rollup-plugin-esbuild';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'noodly_fsm',
        file: 'dist/index.min.js',
        format: 'es',
        plugins: [minify({})],
        sourcemap: true,
      },
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
  {
    input: ['src/fsm.ts'],
    output: [{ file: 'dist/fsm.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
