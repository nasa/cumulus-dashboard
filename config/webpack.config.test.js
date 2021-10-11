const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      path: path.join(__dirname, './app/src'),
    },
  },
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12.18.0',
          esmodules: true,
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: ['@babel/plugin-syntax-jsx'],
  env: {
    test: {
      plugins: [
        [
          'babel-plugin-webpack-alias-7',
          { config: './config/webpack.config.test.js', findConfig: true },
        ],
      ],
    },
  },
};
