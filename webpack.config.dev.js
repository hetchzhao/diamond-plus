const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./demo/main']
  },
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'build'),
    
  },
  // devServer: {

  // },
  resolve: {
    extensions:['.tsx', '.ts', '.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
    alias: {
      '@': './demo'
    }
  },
  module: {
    rules: [{
      test: /.vue$/,
      use: [{ loader: 'vue-loader' }]
    },{
      test: /\.m?jsx?$/,
      exclude: /node_modules/,
      use: [{ loader: 'babel-loader' }]
    },{
      test: /\.ts$/,
      use: [{
        loader: 'babel-loader'
      },{
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [ '\\.vue$' ],
          happyPackMode: false
        }
      }]
    },{
      test: /\.tsx$/,
      use: [{
        loader: 'babel-loader',
      },{
        loader: 'ts-loader',
        options: {
          // TODO: 了解下
          transpileOnly: true,
          happyPackMode: false,
          appendTsxSuffixTo: [ '\\.vue$' ]
        }
      }]
    },
    // style
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },{
      test: /\.less$/
    },{
      test: /\.scss$/
    },{
      test: /\.sass$/
    },
    // Common
    {
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: { name: 'img/[name].[hash:8].[ext]' }
          }
        }
      }]
    },{
      test: /\.(svg)(\?.*)?$/,
      use: [{
        loader: 'file-loader',
        options: { name: 'img/[name].[hash:8].[ext]' }
      }]
    },{
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: { name: 'media/[name].[hash:8].[ext]' }
          }
        }
      }]
    },{
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: { name: 'fonts/[name].[hash:8].[ext]' }
          }
        }
      }]
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './demo/index.html')
    })
  ]
}