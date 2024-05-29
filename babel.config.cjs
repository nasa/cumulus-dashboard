module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env', {
        targets: {
          node: '16.19.0',
          esmodules: true
        }
      }
    ],
    '@babel/preset-react'
  ];

  const plugins = [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime',
    'transform-commonjs',
    ...process.env.NODE_ENV === 'test' && !process.env.CYPRESS_TESTING ? ['babel-plugin-rewire'] : []
  ];

  return {
    presets,
    plugins
  };
};
