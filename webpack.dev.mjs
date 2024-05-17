import webpack from 'webpack';
import mergeWithRules from 'webpack-merge';
import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';

import CommonConfig from './webpack.common.mjs';

export default DevConfig = mergeWithRules({
  devtool: 'replace',
  module: {
    rules: {
      test: 'match',
      use: 'prepend',
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
    },
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
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ESLintPlugin()],
});

