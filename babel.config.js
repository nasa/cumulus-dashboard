module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '16.19.0',
          esmodules: true
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime',
    ...process.env.NODE_ENV === 'test' && !process.env.CYPRESS_TESTING ? ['babel-plugin-rewire'] : []
  ]
};
