import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.tsx',
  plugins: [typescript(), terser()],
  external: ['react', 'react-dom'],
  output: [
    {
      file: 'dist/react-step-router.min.es.js',
      format: 'es',
    },
  ],
};
