require('@babel/register');
const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CSSNano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './app/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 5001
  },
  resolve: {
    alias: {
      Fonts: path.join(__dirname, './app/src/assets/fonts'),
      Images: path.join(__dirname, './app/src/assets/images')
    },
  },
  optimization: {
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
          preset: ['default', { discardComments: { removeAll: true } }]
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
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules/,
          /font-awesome.config.js/
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/react'
            ]
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              // eslint-disable-next-line
              resources: require(path.join(process.cwd(), "./app/src/css/cssUtils.js")),
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: './app/src/assets/[path][name].[hash].[ext]'
          }
        }
      },
      {
        test: /font-awesome\.config\.js/,
        use: [
          { loader: 'style-loader' },
          { loader: 'font-awesome-loader' }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, './app/src/index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].min.css',
    })
  ]
};

