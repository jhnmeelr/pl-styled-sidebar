const path = require('path');

module.exports = {
  entry: './client/index.js',
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(`${__dirname}`, 'build'),
    filename: 'bundle.js',
    library: {
      type: 'umd',
    },
  },
  externals: {
    'react': {
      'commonjs': 'react',
      'commonjs2': 'react',
      'root': 'React'
    },
    'react-redux': {
      'commonjs': 'react-redux',
      'commonjs2': 'react-redux',
      'root': 'Redux'
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ],
  },
};