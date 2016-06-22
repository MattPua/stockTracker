var webpack = require('webpack');
var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, './build');
var APP_DIR = path.resolve(__dirname, 'src/app');

const config = {
  devtool: 'eval-source-map',
  // Add entry to connect hot loading middleware from page
  entry: [
    'webpack-hot-middleware/client',
    APP_DIR + '/app.js',
  //'webpack-dev-server/client?http://0.0.0.0:8080', //WebpackDevServer host and port
  //'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        loaders: ['react-hot'],
        include : APP_DIR, // What directory to look for extensions
        loader : 'babel'
      },
      { 
        test: /\.scss$/, 
        loader: ExtractTextPlugin.extract("css!sass")
        // loaders:['style','css','sass']
      },
      {
        test:   /\.html/,
        loader: 'html',
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, 
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css", { allChunks: true }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      React: 'react'
    }),
    new webpack.HotModuleReplacementPlugin(),
    // Uglify in production.
/*      new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['$super', '$', 'exports', 'require']
        },
        sourcemap: false
      })*/
  ],
  // Some modules might use their own jquery. Use this to resolve other jquery into mine
  resolve: {
    alias: {
      'jquery': path.join(__dirname, 'node_modules/jquery/dist/jquery'),
    }
  }
};

module.exports = config;