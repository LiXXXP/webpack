// 遵循commonjs规范
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let CssExtract = new ExtractTextWebpackPlugin({
    filename: 'css/[name].css',
    // disable: true,
});
let CopyWebpackPlugin = require('copy-webpack-plugin');
let webpack = require('webpack');           // 热更新
let PurifycssWebpack = require('purifycss-webpack');          // 过滤没用到的样式，必须放在new HtmlWebpackPlugin后面
let glob = require('glob');                                    // 搜索用的
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
    }, 	// 入口,可以写数组
    output: {					// 出口
        filename: '[name].js',		// 点后面也可以跟一串随机数,name代表文件名
        path: path.resolve(__dirname, 'build'),			// 这里必须是绝对路径
    },
    devServer: {
        contentBase: './build',				// 打包文件的文件夹(静态文件根目录)
        port: 3000,								// 端口号
        host: 'localhost',						// 域名
        compress: true,						// 服务器压缩
        open: true,								// 自动打开浏览器
        hot: true,								// 热更新 引入webpack自带插件 ，不设置的话默认硬更新，就是全部更新，热更新会保留一些状态
        proxy: {                                // 服务器代理
            "/api": 'http://localhost:3000',
            pathRewrite: { "^/api": "" }
        },
    },				// 配置开发服务器
    // 调试打包后的文件
    devtool: 'source-map',           // 在单独文件中生成，可以映射到列
    //devtool:'cheap-module-source-map',           // 在单独文件中生成，不能映射到列
    //devtool:'eval-source-map',           // 在同一文件中生成，可以映射到列
    //devtool:'cheap-module-eval-source-map',           // 在同一文件中生成，不能映射到列
    // externals: {                    //如果外部引入链接式的js,在这里配置后不会将代码打包
    //     jquery: 'jQuery'
    // },

    module: {
        rules: [		// 解析是从右往左进行的，所以先解析成css模块，用style-loader插入到页面中
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["env", "stage-0", "react"],
                        plugins: ["transform-decorators-legacy"]
                    }
                },
                include: `${__dirname}/src`,
                exclude: /node_modules/
            }, {
                test: /\.(html|htm)$/, use: [
                    {
                        loader: 'html-withimg-loader'
                    }
                ]
            }, {
                test: /\.css$/, use: CssExtract.extract({
                    fallback: "style-loader",           // 配合disable,开发的时候还是要放在style中
                    use: [
                        { loader: 'css-loader' },
                        { loader: 'postcss-loader' },
                    ]
                })
            }, {
                test: /\.(gif|jpg|jpeg|png|bmp|eot|woff|woff2|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',        // url-loader就包含file-loader
                        options: {
                            limit: 4096,      // 小于的话会变成base64编码，大于的话会返回路径
                            // name: './images/[name][hash].[ext]'
                            outputPath: 'images',
                            publicPath: './images'
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyjsWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin(),
        ]
    },
    plugins: [
        CssExtract,
        new CopyWebpackPlugin([
            {
                from: './src/doc',           //从哪
                to: 'public'                 // 考到那
            }
        ]),
        // new webpack.ProvidePlugin({         // lodash使用
        //     _: 'lodash'
        // }),
        new webpack.HotModuleReplacementPlugin(),	// js代码中新增 if(module.hot){ module.hot.accept() } 实现热更新
        new HtmlWebpackPlugin({
            template: './src/index.html',		    // 打包html插件
            title: '标题文字',
            hash: true,							    // 引入文件的随机数
            chunks: ['index']                     // 对应entry中的json,希望引入那个js
        }),
        new PurifycssWebpack({
            paths: glob.sync(`${__dirname}/src/*.html`)      // 消除没用的css
        }),
        new CleanWebpackPlugin(['./build']),	   // 打包时清除 build 文件夹
    ],							// 插件的配置
    // mode: 'development',			// 可以更改模式(生产模式和开发模式) production生产模式
    resolve: {}					// 配置解析
};

// 1.在webpack中如何配置开发服务器 安装模块webpack-dev-server
// 2.webpack插件 将html打包到build中可以自动引入生产的JS 安装模块html-webpack-plugin
// 每次打包都会产生新的文件，我们需要先删除旧的文件，在打包新的文件 安装插件clean-webpack-plugin
// 2.1.热更新，引入webpack自带插件 webpack
// 3.loader webpack所有东西都是模块，但是只支持js模块，我们就需要将css模块转化为js模块
// 4.抽离样式到css文件 安装插件  mini-css-extract-plugin(有点bug)
// extract-text-webpack-plugin@next(@next表示webpack4用的)
// 5.分开抽离样式 new两次
// 6.打包的时候去除不用的样式  安装插件 purifycss-webpack  purify-css glob
// 6.1 自动补全HTML5浏览器前缀  下载插件 postcss-loader autoprefixer
// 6.2 将src下的文件夹原封不动的拷贝到打包目录下       安装插件 copy-webpack-plugin

//正式课
// 7.支持图片 安装插件file-loader(解决图片引入路径问题)
// url-loader(属于优化，当图片小于limit的时候转为base64，大于的时候使用file-loader)
// 图片引入的几种方式

// 1) 在js中引入  import logo from './images/logo.png';
// 2) 在css中正常使用
// 3) 配置目录可以在loader中传参
// 有可能返回一个新的文件路径，也有可能返回一个base64字符串

// 8.压缩css,js   安装插件uglifyjs-webpack-plugin  optimize-css-assets-webpack-plugin
// 8.1在html中使用图片  下载插件 html-withimg-loader
// 8.2配置引入css,js绝对网址路径 output中配置
// 9.转义ES6 ES7 JSX   安装插件
// babel-core babel-loader babel-preset-env babel-preset-stage-0 babel-preset-react babel-plugin-transform-decorators-legacy
// 9.1 调试打包后的文件 配置项devtool:''  生产模式不能使用
// 10.引入外部第三方类库  安装 lodash  使用自带的webpack插件ProvidePlugin  在index.js中使用 import _ from 'lodash';
// 10.1 服务器代理 proxy










