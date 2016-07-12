var webpack           = require('webpack');
var path              = require('path');
var autoprefixer      = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR         = path.resolve(__dirname, './build');
var APP_DIR           = path.resolve(__dirname, 'src/app');

var IS_PRODUCTION     = process.env.NODE_ENV === 'production';
if (IS_PRODUCTION) console.log("----------------PRODUCTION MODE--------------------");
else console.log('-------------------DEVELOPMENT MODE--------------------');

var plugins = [
  new ExtractTextPlugin("style.css", { allChunks: false }),
  // Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
  // inside your code for any environment checks; UglifyJS will automatically
  // drop any unreachable code.
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development") }
    }
  }),
  new webpack.ProvidePlugin({
    React: 'react'
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  // Aggressively remove duplicate modules:
  new webpack.optimize.DedupePlugin()
];
var entries = [APP_DIR + '/app.js',];

if (IS_PRODUCTION){
  plugins.push(
    // Uglify in production.
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      },
      output: { comments: false },
      exclude: [ /\.min\.js$/gi ],   // skip pre-minified libs
      sourcemap: false,
      minimize: true
    })
  );
}
else{
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
  entries.push(
    // Add entry to connect hot loading middleware from page
    'webpack-hot-middleware/client',
    'webpack/hot/dev-server'
  );
}

const config = {
  entry: entries,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '',
  },
  // `webpack-dev-server` spawns a live-reloading HTTP server for your project.
  devServer: {
    port: process.env.PORT || 8080,
    contentBase: './src',
    historyApiFallback: true,
    hot: true,
    // Set this if you want to enable gzip compression for assets
    compress: true,
    stats: {
      chunks: false,
      colors: true
    }
  },
  module : {
    preLoaders: [
      { 
        test: /\.jsx$|\.js$/,
        loaders: ['eslint-loader'],
        exclude: /node_modules/
      }
    ],
    loaders : [
      {
        test : /(\.jsx|\.js)$/,
        loaders: ['react-hot','babel-loader'],
        exclude: /node_modules/,
        include : APP_DIR, // What directory to look for extensions
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
  sassLoader: {
    includePaths: [path.resolve(process.cwd(), 'node_modules')],
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  plugins: plugins,
  eslint: {
    reporter: require("eslint-friendly-formatter"),
    quiet: true,
    failOnError: true,
    failOnWarning: false,
    emitError: true,
    emitWarning: true
  },
  resolve: {
    alias: {
      // Some modules might use their own jquery. Use this to resolve other jquery into mine
      'jquery': path.join(__dirname, 'node_modules/jquery/dist/jquery'),
    }
  }
};
if (!IS_PRODUCTION){
  // Generate external sourcemaps for the JS & CSS bundles
  config['devtool'] = 'inline-source-map';
}
module.exports = config;