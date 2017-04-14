var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './src/main/web/polyfills.ts',
    'vendor': './src/main/web/vendor.ts',
    'app': './src/main/web/main.ts'
  },
  node: {
    fs: "empty"
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [{
          loader: 'awesome-typescript-loader',
          options: {configFileName: helpers.root('.', 'tsconfig.json')}
        }, 'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        loader: 'file-loader'
      },
      {
          test: /\.xlf/,
          loader: 'raw-loader'
      }
    ]
  },

  plugins: [

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('.'), // location of your src
      {
        // your Angular Async Route paths relative to this root directory
      }
    ),

    new CopyWebpackPlugin([
        {from: 'src/main/web/assets/images/favicon.ico', to: 'favicon.ico'},
        {from: 'src/main/web/assets/css/specific.css', to: 'styles/specific.css'},
        {from: 'src/main/web/assets/css/spinner.css', to: 'styles/spinner.css'}
    ]),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/main/web/index.html'
    })
  ]
};

