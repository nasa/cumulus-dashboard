import '@babel/register';

import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

import config from './app/src/js/config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    publicPath: '/',
/*     library: {
      type: 'module',
  }, */
  },
  optimization: {
    moduleIds: 'deterministic',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.cjs', '.mjs', '.scss'],
    alias: {
      Fonts: path.join(__dirname, 'app/src/assets/fonts'),
      Images: path.join(__dirname, 'app/src/assets/images'),
    },
    fallback: {
      fs: false,
      net: false,
      tls: false,
      console: 'console-browserify',
      path: 'path-browserify',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      util: 'util',
      vm: 'vm-browserify'
    },
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        type: 'javascript/auto',
        exclude: [
          /node_modules\/(?!(map-obj|snakecase-keys|strict-uri-encode|fast-xml-parser)\/).*/,
          /font-awesome.config.mjs/,
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              presets: [
                '@babel/preset-env', 
                {
                  corejs: '3.0.0',
                  debug: false,
                  modules: false,
                },
                '@babel/preset-react'
              ],
            },
          },
        ],
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'css-loader', // Translates CSS into CommonJS
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader', // Compiles Sass to CSS
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, // fonts
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
            outputPath: 'fonts/',
            publicPath: '../',
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)(\?[a-z0-9=.]+)?$/, // images/graphics
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[hash].[ext]',
            outputPath: 'images/',
            publicPath: '../',
          },
        },
      },
      {
        test: /font-awesome\.config\.js/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'font-awesome-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app/src/template.html'),
      filename: 'index.html',
      title: 'Cumulus Dashboard',
      favicon: './app/src/public/favicon.ico'
    }),
    new CopyPlugin({
      patterns: [{ from: './app/src/public', to: './' }],
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery', // can use jquery anywhere in the app without having to require it
      $: 'jquery',
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      APIROOT: config.apiRoot,
      AWS_REGION: config.awsRegion,
      DAAC_NAME: config.target,
      STAGE: config.environment,
      HIDE_PDR: config.nav.exclude.PDRs,
      AUTH_METHOD: config.oauthMethod,
      KIBANAROOT: config.kibanaRoot,
      BUCKET: config.graphicsPath,
      ENABLE_RECOVERY: config.enableRecovery,
      SERVED_BY_CUMULUS_API: config.servedByCumulusAPI,
    }),
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        useESModules: true
      }
    ]
  ],
/*   experiments: {
    outputModule: true,
  }, */
};

export default CommonConfig;