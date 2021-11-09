'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  // The entry file. All your app roots from here.
  entry: [
      // Polyfills go here too, like babel-polyfill or whatwg-fetch
      path.join(__dirname, 'src', 'index.tsx')
  ],
  devtool: 'inline-source-map',
  // Where you want the output to go
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].min.js',
  },
  plugins: [
    // handles creating an index.html file and injecting assets. necessary because assets
    // change name because the hash part changes. We want hash name changes to bust cache
    // on client browsers.
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    // extracts the css from the js files and puts them on a separate .css file. this is for
    // performance and is used in prod environments. Styles load faster on their own .css
    // file as they dont have to wait for the JS to load.
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'icon/icon*.*', context: path.join(__dirname, 'src') },
      ]
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            configFile: '.eslintrc',
            failOnWarning: false,
            failOnError: true,
            fix: true,
          },
        },
        enforce: 'pre',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      { test: /\.png$/, use: 'url-loader?prefix=app/assets/&limit=10000&mimetype=image/png' },
      { test: /\.jpg$/, use: 'url-loader?prefix=app/assets/&limit=10000&mimetype=image/jpeg' },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      { test: /\.(ttf|eot)(\?[a-z0-9#=&.]+)?$/, use: 'file-loader' },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 3000,
    hot: true,
  },
};
