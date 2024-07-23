// This config is used in eslint config for parsing
module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-import-assertions',
    ['babel-plugin-transform-import-meta', { 'module': 'ES6' }],
    //...process.env.NODE_ENV === 'test' && !process.env.CYPRESS_TESTING ? ['babel-plugin-rewire'] : []
  ]
};