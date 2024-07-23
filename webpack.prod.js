import path from 'path';
import { fileURLToPath } from 'url';
import { mergeWithRules } from 'webpack-merge';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserJsPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as pkg from './package.json' assert { type: 'json' };

import CommonConfig from './webpack.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//const pkg = JSON.parse('./package.json');

const servedByCumulusAPI = process.env.SERVED_BY_CUMULUS_API;

const publicPath = servedByCumulusAPI ? './' : '/';

const MainConfig = mergeWithRules({
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
              esModule: true,
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

export default MainConfig;