// webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const HappyPack = require('HappyPack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// const PurifyCSS = require('purifycss-webpack')
// const glob = require('glob-all')

module.exports = {
    entry:  path.join(__dirname, 'src/spa/index.js'),
    mode:'develop',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.vue', '.js'],
        modules: ['node_modules'],
        alias: {
          components: __dirname + '/src/components/',
          assets: __dirname + '/src/assets/'
        }
    },
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        // 一个loader对应一个id
                        loader: "happypack/loader?id=luckfine"
                    }
                ]
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 具体配置见插件官网
                            limit: 10000,
                            name: '[name]-[hash:5].[ext]'
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                          mozjpeg: {
                            progressive: true,
                            quality: 65
                          },
                          // optipng.enabled: false will disable optipng
                          optipng: {
                            enabled: false,
                          },
                          pngquant: {
                            quality: '65-90',
                            speed: 4
                          },
                          gifsicle: {
                            interlaced: false,
                          },
                          // the webp option will enable WEBP
                          webp: {
                            quality: 75
                          }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    // 文件大小小于limit参数，url-loader将会把文件转为DataUR
                    limit: 10000,
                    name: '[name]-[hash:5].[ext]',
                    output: 'fonts/',
                    // publicPath: '', 多用于CDN
                }
            }
        ]
    },
    resolve: {
        extensions: [
          '.vue', '.js'
        ],
        modules: ["node_modules"],
        alias: {
          vue: 'vue/dist/vue.min.js',
          components: path.resolve(__dirname + '/src/components/'),
          '@': path.resolve('src')
        }
    },
    devtool: 'inline-source-map',
    devServer: {
        clientLogLevel: 'warning', // 输出日志级别
        hot: true, // 启用热更新
        contentBase: path.resolve(__dirname, 'dist'), // 告诉服务器从哪里提供内容
        publicPath: '/', // 此路径下的打包文件可在浏览器下访问
        compress: true, // 启用gzip压缩
        // publicPath: './',
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 8080,
        open: true, // 自动打开浏览器
        overlay: { // 出现错误或者警告时候是否覆盖页面线上错误信息
            warnings: true,
            errors: true
        },
        quiet: true,
        watchOptions: { // 监控文件相关配置
            poll: true,
            ignored: /node_modules/, // 忽略监控的文件夹, 正则
            aggregateTimeout: 300, // 默认值, 当你连续改动时候, webpack可以设置构建延迟时间(防抖)
        }
    },
    plugins:[
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            cache: true,
            chunksSortMode: 'none',
            title: '页面模板', // 可以由外面传入
            filename: 'index.html', // 默认index.html
            template: 'src/spa/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new HappyPack({
              // 用唯一的标识符id，来代表当前的HappyPack是用来处理一类特定的文件
              id:'luckfine',
                //如何处理  用法和loader 的配置一样
              loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
              }],
              //共享进程池
              threadPool: happyThreadPool,
              //允许 HappyPack 输出日志
              verbose: true,
        }),
        new VueLoaderPlugin(),
        //     // 清除无用 css
        // new PurifyCSS({
        //     paths: glob.sync([
        //         // 要做 CSS Tree Shaking 的路径文件
        //         path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        //         path.resolve(__dirname, './src/*.js')
        //     ])
        // })
    ],
    devServer: {
        historyApiFallback: {
          index: `/dist/h5/index.html`
        },
        host: '0.0.0.0',
        disableHostCheck: true
    }
}