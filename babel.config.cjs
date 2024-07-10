// This config is used in eslint config for parsing
module.exports = {
    targets: {
      node: '16.19.0',
      esmodules: true,
    },
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-import-assertions',
    ...process.env.NODE_ENV === 'test' && !process.env.CYPRESS_TESTING ? ['babel-plugin-rewire'] : []
  ],
};