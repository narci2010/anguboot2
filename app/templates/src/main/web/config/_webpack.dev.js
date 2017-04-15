var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const env = process.env.NODE_ENV || process.env.env || 'dev';
const version = process.env.version || null;
const base_url = process.env.base_url || 'http://localhost:<%= port %>/';
const log_level = process.env.log_level || 'DEBUG';

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('target/classes/public'),
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'CONSTANTS': {
        'env': JSON.stringify(env),
        'version': JSON.stringify(version),
        'base_url': JSON.stringify(base_url),
        'log_level': JSON.stringify(log_level)
      }
    })<% if (plugins.custo) { %>,
    new CopyWebpackPlugin([
        { from: 'src/clients'},
        { from: 'src/main/web/assets/scss', to: 'scss' },
        { from: 'node_modules/bootstrap/scss', to: 'scss/bootstrap'},
        { from: 'node_modules/font-awesome/scss', to: 'scss/font-awesome'},
        { from: 'node_modules/angular2-toaster/toaster.css', to: 'scss/toaster/toaster.css'},
        { from: 'node_modules/sass.js/dist', to: 'sass' }
    ])<%}%>
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
