var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV_DEV = 'development';
var ENV_PROD = 'production';
var ENV_TEST = 'test';

var BUILD_DIR = path.resolve(__dirname, 'lib');
var APP_DIR = path.resolve(__dirname, 'src');

var env = process.env.NODE_ENV || ENV_DEV;

var isDev = env === ENV_DEV;
var isProd = env === ENV_PROD;
var isTest = env === ENV_TEST;

var pkg = require('./package.json');
var banner = [
  pkg.name,
  'Version - ' + pkg.version,
  'Author - ' + pkg.author
].join('\n');

console.log(env);

var definePlugin = new webpack.DefinePlugin({
  __DEV__: env === ENV_DEV,
  __PROD__: env === ENV_PROD,
  __TEST__: env === ENV_TEST,
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
  'process.env.NODE_ENV': '"' +env+ '"'
});

var bannerPlugin = new webpack.BannerPlugin(banner);

function getPlugins(env) {
  var plugins = [definePlugin];
  if (env !== ENV_PROD) {
    plugins.push(new webpack.NoErrorsPlugin());
  } else {
    plugins.push(new ExtractTextPlugin('[name].css'));
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      mangle: true,
    }));
    plugins.push(bannerPlugin);
  }
  return plugins;
}


function getEntry(env) {
  var entry = {};
  var entries = [];
  if (env !== ENV_PROD) {
    entries.push('webpack-dev-server/client?http://localhost:8080/');
    entries.push('webpack/hot/only-dev-server');
  }
  entries.push('./index');
  entry.index = entries;
  return entry;
}

function getLoaders(env) {
  var loaders = [];
  loaders.push({
    test: /\.js$/,
    include: APP_DIR,
    loaders: ['babel'],
    exclude: /node_modules/
  });

  loaders.push({
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'file'
  });

  if (env === ENV_PROD ) {
    loaders.push({
      test: /(\.css)$/,
      loader: ExtractTextPlugin.extract("css?sourceMap")
    });
  } else {
    loaders.push({
      test: /(\.css|\.scss)$/,
      loaders: ['style', 'css?sourceMap']
    });
  }
  return loaders;
}


module.exports = {
  context: APP_DIR,
  debug: true,
  entry: getEntry(env),
  target: 'web',
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: '[name].js',
    library: ['AppBase'],
    libraryTarget: 'umd'
  },
  plugins: getPlugins(env),
  module: {
    loaders: getLoaders(env),
  },
  resolve: {
    extensions: ['', '.js'],
    root: APP_DIR,
    modulesDirectories: ['node_modules'],
  },
  devServer: {
    historyApiFallback: true
  }
};
