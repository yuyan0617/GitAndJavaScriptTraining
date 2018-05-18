const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = location => path.resolve( __dirname, location )

const MODE = process.env.MODE || 'development'

module.exports = {
  entry: resolve('src/entry.js'),
  devtool: MODE === 'development' ? 'source-map' : false,
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: MODE === 'development',
            }
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(gif|png|jpg|svg)$/,
        loader: 'url-loader'
      },
    ]
  },
  output: {
    path: resolve('dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('src/static/index.html')
    })
  ]
}
