var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

var constants = {
  env: 'production',
  version: null,
  mock_http: false,
  base_url: '',
  log_level: 'INFO'
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
      'CONSTANTS': JSON.stringify(constants)
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});

