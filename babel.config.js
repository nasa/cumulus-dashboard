module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '10.6.3',
          esmodules: true
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime'
  ]
};
