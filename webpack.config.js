// const path = require('path')
import path from 'path'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import loaders from 'webpack.loaders'

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'recapitulation.js'
  },
  module: {
    rules: loaders
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/zero.html",
      filename: "./index.html"
    })
  ]
};
