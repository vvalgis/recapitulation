import path from 'path'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'

const loader = (name) => {
  return {
    exclude: /node_modules/,
    use: {
      loader: `${name}-loader`
    }
  }
}

const jsLoader = { test: /\.(?:jsx|js)$/, ...loader('babel') }
const htmlLoader = { test: /\.html$/, ...loader('html') }

const cssExtract = {
  loader: MiniCssExtractPlugin.loader,
  options: { hmr: false }
}

const cssLoader = {
  test: /\.css$/,
  use: [
    cssExtract,
    'css-loader'
  ],
  exclude: [/node_modules/]
}

const vendorCssLoader = {
  test: /\.css$/,
  use: [
    cssExtract,
    'css-loader'
  ],
  include: [/node_modules\/normalize.css/]
}

const sssLoader = {
  test: /\.sss$/,
  use: [
    cssExtract,
    { loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[local]___[hash:base64:5]'
        },
        importLoaders: 1,
        sourceMap: true,
        onlyLocals: false
      }
    },
    'postcss-loader'
  ]
}

const loaders = [
  jsLoader,
  htmlLoader,
  cssLoader,
  vendorCssLoader,
  sssLoader
]

const plugins = [
  new HtmlWebPackPlugin({
    template: "./src/zero.html",
    filename: "./index.html"
  }),
  new MiniCssExtractPlugin({
    // filename: '[name].css',
    // chunkFilename: '[id].css',
    // ignoreOrder: false, // Enable to remov
  }),
  new CopyPlugin([{ from: 'node_modules/sql.js/dist/sql-wasm.wasm', to: './' }]),
]

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'recapitulation.js'
  },
  module: {
    rules: loaders
  },
  plugins,
  resolve: {
    modules: [
      'node_modules',
      'src',
    ],
    extensions: ['.js', '.jsx', '.css', '.scss', '.sss'],
  },
  devtool: 'inline-source-map',
  node: {
   fs: 'empty'
  },
}
