const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSNano = require('cssnano');

const CommonConfig = require('./webpack.common');

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
    publicPath: '/'
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
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
            loader: 'style-loader'
          },
          {
            loader: MiniCssExtractPlugin.loader
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].min.css',
      chunkFilename: '[id].[contenthash].min.css',
    })
  ]
});

module.exports = MainConfig;
