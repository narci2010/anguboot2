var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var constants = {
  env: 'dev',
  version: null,
  mock_http: false,
  base_url: 'http://localhost:<%= port %>/',
  log_level: 'DEBUG'
};

for (var i in process.argv) {
  if (process.argv[i].indexOf('--env.') > -1) {
    var arg = process.argv[i].substring(6, process.argv[i].indexOf('='));
    var value = process.argv[i].substring(process.argv[i].indexOf('=') + 1);
    if(constants[arg] !== undefined){
      constants[arg] = value;
    }
  }
}

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
      'CONSTANTS': JSON.stringify(constants)
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
    historyApiFallback: false,
    stats: 'minimal'
  }
});
