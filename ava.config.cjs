module.exports = {
  babel: {
    extensions: ['.js', '.jsx'],
    testOptions: {
      babelrc: true,
      configFile: './babel.config.cjs',
      plugins: [
        '@babel/plugin-syntax-jsx',
        [
          // Webpack
          'babel-plugin-webpack-alias-7',
          {
            config: './config/webpack.config.test.js',
          },
        ],
      ],
      presets: [
        ['module:@ava/babel/stage-4', 
          {
            modules: false // Disable ava converting ESM syntax to CommonJS
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
