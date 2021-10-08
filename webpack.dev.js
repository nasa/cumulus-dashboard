const webpack = require('webpack');
const path = require('path');
const { mergeWithRules } = require('webpack-merge');

const CommonConfig = require('./webpack.common');

const DevConfig = mergeWithRules({
  devtool: 'replace',
  module: {
    rules: {
      use: 'prepend'
    },
  },
})(CommonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: false,
    historyApiFallback: { disableDotRule: true },
    // host: '0.0.0.0', // Required for Docker -- someone will need to link this somehow
    compress: true,
    port: process.env.PORT || 3000,
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
      publicPath: '/',
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            // Creates `style` nodes from JS strings
            loader: 'style-loader',
          },
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});

module.exports = DevConfig;
