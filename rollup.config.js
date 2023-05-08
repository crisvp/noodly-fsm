// rollup.config.js
import typescript from '@rollup/plugin-typescript';
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
];
