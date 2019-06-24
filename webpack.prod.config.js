const merge = require('webpack-merge')
const webpack = require('webpack');
const baseConfig = require('./webpack.config.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssertsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path')


const devMode = process.env.NODE_ENV === 'production'


module.exports = merge(baseConfig, {
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath:
            devMode
                ? '//baidu/assets/'
                : '//localhost:8080/',
        filename:
            devMode
                ? '[name].js'
                : '[name].[chunkhash:12].js'
    },
    optimization: {
        usedExports:true,
        minimizer: [
            // 压缩CSS
            new OptimizeCSSAssertsPlugin({}),
            // 压缩JS
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                	MiniCssExtractPlugin.loader,
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
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash:8].css', 
            chunkFilename: devMode ? '[id].css': '[id].[hash:8].css'
        })
    ]
})