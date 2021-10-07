const path = require('path');
const { mergeWithCustomize, customizeObject } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('./package.json');

const CommonConfig = require('./webpack.common');

const servedByCumulusAPI = process.env.SERVED_BY_CUMULUS_API;

const publicPath = servedByCumulusAPI ? './' : '/';

const MainConfig = mergeWithCustomize({
  custumizeObject: customizeObject({
    devtool: 'replace',
    'module.rules.use': 'prepend'
  })
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
    moduleIds: 'deterministic',
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserJsPlugin({
        parallel: true,
        include: /\.js$/
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments:
              {
                removeAll: true
              }
            }
          ]
        }
      })
    ],
    runtimeChunk: true,
    sideEffects: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].[chunkhash:8]-${pkg.version}.css`,
      chunkFilename: `[id].[chunkhash:8]-${pkg.version}.css`
    })
  ]
});

module.exports = MainConfig;
