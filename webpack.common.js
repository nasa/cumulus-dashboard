require('@babel/register');
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');

const config = require('./app/src/js/config');

const CommonConfig = {
  target: 'web',
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    './app/src/index.js',
  ],
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      Fonts: path.join(__dirname, 'app/src/assets/fonts'),
      Images: path.join(__dirname, 'app/src/assets/images')
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          /node_modules\/(?!(map-obj|snakecase-keys|strict-uri-encode|qs|fast-xml-parser)\/).*/,
          /font-awesome.config.js/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'css-loader', // Translates CSS into CommonJS
            options: {
              sourceMap: true,
              importLoaders: 1
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
            loader: 'sass-loader', // Compiles Sass to CSS
            options: {
              sourceMap: true
            }
          },
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, // fonts
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
            outputPath: 'fonts/',
            publicPath: '../'
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)(\?[a-z0-9=.]+)?$/, // images/graphics
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
            outputPath: 'images/',
            publicPath: '../'
          }
        }
      },
      {
        test: /font-awesome\.config\.js/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'font-awesome-loader'
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, 'app/src/template.html'),
      filename: 'index.html',
      title: 'Cumulus Dashboard'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      { from: './app/src/public', to: './' }
    ]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery', // can use jquery anywhere in the app without having to require it
      $: 'jquery'
    }),
    new webpack.EnvironmentPlugin(
      {
        APIROOT: config.apiRoot,
        DAAC_NAME: config.target,
        STAGE: config.environment,
        HIDE_PDR: config.nav.exclude.PDRs,
        AUTH_METHOD: config.oauthMethod,
        KIBANAROOT: config.kibanaRoot,
        ESROOT: config.esRoot,
        SHOW_TEA_METRICS: config.showTeaMetrics,
        SHOW_DISTRIBUTION_API_METRICS: config.showDistributionAPIMetrics,
        BUCKET: config.graphicsPath,
        ENABLE_RECOVERY: config.enableRecovery,
        ES_USER: config.esUser,
        ES_PASSWORD: config.esPassword,
        SERVED_BY_CUMULUS_API: config.servedByCumulusAPI
      }
    )
  ]
};

module.exports = CommonConfig;
