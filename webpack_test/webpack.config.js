// webpack的配置文件
// 开发环境的配置：能让代码自动化运行
// 生产环境的配置：压缩、兼容
// 作用：指示webpack干哪些活，运行webpack指令时，会加载里面的配置
// 所有的构建工具都是基于nodejs平台运行的!模块化默认采用commonjs
// 项目的代码和配置的代码是两方面ES6/CommonJs
// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// process.env.NODE_ENV = "production";
// optimize-css-assets-webpack-plugin
module.exports = {
  // webpack的配置
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    // __dirname nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build'),
  },
  // loader的配置
  module: {
    rules: [
      // 详细loader配置
      {
        // 匹配哪些文件
        test: /\.css$/,
        // 使用哪些loader
        use: [
          // use数组中loader执行顺序，从右到左，从下到上，依次执行
          // 创建style标签，将js中的样式资源插入进去，添加到head中生效
          // "style-loader",
          // 这个loader取代了style-loader。作用：提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载到js中，里面内容是样式字符串
          'css-loader',
          // css兼容性处理:postcss-->postcss-loader  postcss-preset-env
          // 帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式
          // browserslist默认是生产环境，需要设置node环境变量:process.env.NODE_ENV=development
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')(),
              ],
            },
          },
        ],
      },
      {
        // 匹配哪些文件
        test: /\.less$/,
        // 使用哪些loader
        use: [
          // use数组中loader执行顺序，从右到左，从下到上，依次执行
          // 创建style标签，将js中的样式资源插入进去，添加到head中生效
          'style-loader',
          // 将css文件变成commonjs模块加载到js中，里面内容是样式字符串
          'css-loader',
          // 将less文件编译成css文件
          'less-loader',
        ],
      },
      {
        // 问题：默认处理不了html中img图片
        test: /\.(jpg|png|gif)$/,
        // 下载url-loader file-loader
        // 处理样式中url
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，就会被base64处理,变成字符串可以直接显示后面不需要再请求
          // 优点：减少请求数量(减轻服务器压力)
          // 缺点：图片体积会更大(文件请求速度更慢)
          limit: 8 * 1024,
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
          // 解析时会出问题：[object Module]
          // 关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          outputPath: 'imgs',
        },
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片(负责引入img,从而能被url-loader进行处理)
        loader: 'html-loader',
      },
      {
        // 打包其他资源(除了html/js/css资源意外的资源)
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: 'file-loader',
      },
      {
        // 语法检查：eslint-loader eslint
        // 注意：只检查自己写的源代码，第三方的库是不用检查的
        // 设置检查规则：package.json中eslintConfig中设置~airbnb
        // eslint-config-airbnb-base eslint eslint-plugin
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  // plugins的配置
  // 会默认创建一个空的HTML，自动引入打包输出的所有资源js/css
  plugins: [
    new HtmlPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin({ filename: 'css/built.css' }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  mode: 'development',
  // 开发服务器devServer:用来自动化(自动编译，自动打开浏览器，自动刷新浏览器)
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为:npx webpack-dev-server  需要安装webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 指定开发服务器端口号
    port: 3000,
    // 自动打开默认浏览器
    open: true,
  },
};