const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  console.log('argv', argv.mode, 'env:', env)

  const backend_url =
    argv.mode === 'production'
      ? 'https://blooming-atoll-75500.herokuapp.com/api/notes'
      : 'http://localhost:3001/notes'

  return {
    entry: path.resolve(__dirname, './src/index.js'),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      hot: true,
      port: 3000,
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(`${backend_url}`),
      }),
    ],
  }
}

module.exports = config
