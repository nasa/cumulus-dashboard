module.exports = {
  babel: {
    extensions: ['.js', '.jsx', '.mjs', '.cjs'],
    testOptions: {
      plugins: [
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-transform-modules-commonjs',
        [
          'babel-plugin-webpack-alias-7',
          {
            config: './config/webpack.config.test.js',
          },
        ],
      ],
      presets: [
        ['module:@ava/babel/stage-4', 
          {
            modules: false
          }
        ]
      ]
    },
  },
  require: ['esm', '@babel/register', './test/_setup-browser-env.js', 'ignore-styles'],
  timeout: '3m',
  files: [
    'test/**/*',
    '!test/**/condition*',
    '!node_modules/',
    '!test/fixtures/**/*',
  ],
  environmentVariables: {
    NODE_ENV: 'test',
  },
};
