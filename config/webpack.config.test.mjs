import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testConfig = {
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.cjs', '.scss'],
    alias: {
      path: path.join(__dirname, './app/src'),
    },
  },
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '16.19.0',
          esmodules: true,
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-jsx'
  ],
  env: {
    test: {
      plugins: [
        [
          'babel-plugin-webpack-alias-7',
          { config: './config/webpack.config.test.mjs', findConfig: true },
        ],
      ],
    },
  },
};

export default testConfig;