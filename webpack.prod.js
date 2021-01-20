const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSNano = require('cssnano');
const pkg = require('./package.json');

const CommonConfig = require('./webpack.common');

const servedByCumulusAPI = process.env.SERVED_BY_CUMULUS_API;

const publicPath = servedByCumulusAPI ? './' : '/';

const MainConfig = merge.smartStrategy({
  devtool: 'replace',
  'module.rules.use': 'prepend'
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
        cache: true,
        parallel: true,
        sourceMap: true,
        include: /\.js$/
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: CSSNano,
        cssProcessorPluginOptions: {
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
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          maxSize: 500000
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all'
        }
      }
    },
    runtimeChunk: true,
    sideEffects: true
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
            loader: MiniCssExtractPlugin.loader
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `[name].[chunkhash:8]-${pkg.version}.css`,
      chunkFilename: `[id].[chunkhash:8]-${pkg.version}.css`
    })
  ]
});

module.exports = MainConfig;
