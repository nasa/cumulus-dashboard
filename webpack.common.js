import '@babel/register';
import path from 'path';
import { fileURLToPath } from 'url';
// Plugins
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

import config from './app/src/js/config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CommonConfig = {
  target: ['web','es6' ],
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    './app/src/index.js',
  ],
  node: {
    global: true,
    __filename: true,
    __dirname: true,
},
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
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
    },
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        type: 'javascript/auto',
        exclude: [
          /node_modules\/(?!(map-obj|snakecase-keys|strict-uri-encode|fast-xml-parser)\/).*/,
          /font-awesome.config.mjs/,
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'module',
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
        test: /font-awesome\.config\.mjs/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'font-awesome-loader',
          },
        ],
      },
      { test: /\.node$/, use: "node-loader" }
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
    new NodePolyfillPlugin({
      additionalAliases: ['console', 'path', 'stream', 'crypto', 'util', 'vm'],
    }),
    new ESLintWebpackPlugin({
      configType: 'flat',
      eslintPath: 'eslint/use-at-your-own-risk',
      overrideConfigFile: 'eslint.config.js',
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery', // can use jquery anywhere in the app without having to require it
      $: 'jquery',
      process: 'process/browser.js',
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
  ],
};

export default CommonConfig;