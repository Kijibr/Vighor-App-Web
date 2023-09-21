import Dotenv from 'dotenv-webpack';
import * as webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const SRC_DIR = path.join(__dirname, "src")
const PUBLIC_DIR = path.join(__dirname, "public")
const BUILD_DIR = path.join(__dirname, "build")

const entry = path.resolve(SRC_DIR, "index.tsx");
const html = path.resolve(PUBLIC_DIR, "index.html");

const exclude = /node_modules/;

const isProduction = process.env.NODE_ENV === 'production';

const htmlPlugin = new HtmlWebpackPlugin({
  template: html,
  filename: './index.html',
  publicPath: "/"
})

const dotEnvPlugin = new Dotenv({
  path: __dirname + "/.env",
  systemvars: true
});

const cssLoader: webpack.RuleSetRule = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    importLoaders: 2,
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
    },
  },
};

export const postcss: webpack.RuleSetRule = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
  },
};

export const resolveUrl: webpack.RuleSetRule = {
  loader: 'resolve-url-loader',
};

export const scss: webpack.RuleSetRule = {
  loader: 'sass-loader',
  options: {
    sourceMap: true,
  },
};

export const style: webpack.RuleSetRule = {
  loader: 'style-loader',
};

module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ]
            }
          }, {
            loader: "ts-loader"
          },
        ],
        exclude,
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "file-loader",
      }, {
        test: /\.css$/,
        // exclude,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', ".png", ".svg"],
    modules: [SRC_DIR, "node_modules"],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  plugins: [htmlPlugin, dotEnvPlugin],
  output: {
    filename: 'bundle.js',
    path: path.resolve(BUILD_DIR, 'dist'),
  },
  devServer: {
    open: true,
    port: 5000,
    compress: true,
    historyApiFallback: true
  }
};