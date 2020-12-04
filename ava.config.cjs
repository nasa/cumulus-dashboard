module.exports = {
  babel: {
    testOptions: {
      plugins: [
        '@babel/plugin-syntax-jsx',
        [
          'babel-plugin-webpack-alias-7',
          {
            config: './config/webpack.config.test.js',
          },
        ],
      ],
    },
    extensions: ['js', 'jsx', 'ts'],
  },
  require: ['@babel/register', 'ignore-styles'],
  timeout: '3m',
  files: ['test/**/*', '!node_modules/', '!test/fixtures/**/*'],
};
