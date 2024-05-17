import path from 'path';
import mergeWithRules from 'webpack-merge';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import TerserJsPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import pkg from './package.json';

import CommonConfig from './webpack.common.mjs';

const servedByCumulusAPI = process.env.SERVED_BY_CUMULUS_API;

const publicPath = servedByCumulusAPI ? './' : '/';

export default MainConfig = mergeWithRules({
  devtool: 'replace',
  module: {
    rules: {
      test: 'match',
      use: 'prepend',
    },
  },
})(CommonConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath,
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserJsPlugin({
        parallel: true,
        include: /\.js$/,
        terserOptions: {
          sourceMap: true,
        }
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          maxSize: 500000,
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
        },
      },
    },
    runtimeChunk: true,
    sideEffects: true,
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
          {
            // Minifies CSS files
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].[chunkhash:8]-${pkg.version}.css`,
      chunkFilename: `[id].[chunkhash:8]-${pkg.version}.css`,
    }),
  ],
});

