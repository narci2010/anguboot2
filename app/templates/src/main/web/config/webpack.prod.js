var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const env = process.env.NODE_ENV || process.env.env || 'production';
const version = process.env.version || null;
const base_url = process.env.base_url || '';
const log_level = process.env.log_level || 'INFO';

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('../../../target/classes/public'),
    publicPath: './',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'CONSTANTS': {
        'env': JSON.stringify(env),
        'version': JSON.stringify(version),
        'base_url': JSON.stringify(base_url),
        'log_level': JSON.stringify(log_level)

      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});

