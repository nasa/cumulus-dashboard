module.exports = {
  babel: {
    testOptions: {
      plugins: [
        '@babel/plugin-syntax-jsx',
        [
          {
            config: './config/webpack.config.test.js',
          },
        ],
      ],
    },
    extensions: ['js', 'jsx', 'ts'],
  },
  require: ['@babel/register', './test/_setup-browser-env.js', 'ignore-styles'],
  timeout: '3m',
  files: ['test/**/*', '!test/**/condition*', '!node_modules/', '!test/fixtures/**/*'],
  environmentVariables: {
    NODE_ENV: 'test'
  }
};
