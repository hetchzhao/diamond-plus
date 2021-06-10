const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    lib: './src/index.ts'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  // TODO: 了解
  externals: {
    vue: {
      root: 'Vue', // 指向全局变量
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  // devtool: 'source-map',
  resolve: {
    extensions:['.tsx', '.ts', '.mjs', '.js', '.jsx', '.vue', '.json', '.wasm']
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: [{ loader: 'vue-loader' }]
    },{
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
    },{
      test: /\.pug$/,
      oneOf: []
    },{
      test: /\.css$/,
      oneOf: [
        {
          use: [
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: { hmr: false, publicPath: '../' }
          // },
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: { sourceMap: false, importLoaders: 2 }
          },{
            loader: 'postcss-loader',
            options: { sourceMap: false }
          }]
        }
      ]
    },
    // {
    //   test: /\.p(ost)?css$/,
    // },{
    //   test: /\.scss$/
    // },{
    //   test: /\.sass$/
    // },{
    //   test: /\.less$/
    // },
    {
      test: /\.m?jsx?$/,
      use: [{
        loader: 'babel-loader'
      }]
    },{
      test: /\.ts$/,
      use: [{
        loader: 'babel-loader'
      },{
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [ '\\.vue$' ],
          happyPackMode: true
        }
      }]
    },{
      test: /\.tsx$/,
      use: [{
        loader: 'babel-loader',
      },{
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          happyPackMode: true,
          appendTsxSuffixTo: [ '\\.vue$' ]
        }
      }]
    }]
  },
  optimization: {
    minimize: true,
    minimizer: []
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}