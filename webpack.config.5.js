// 遵循commonjs规范
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let LessExtract=new ExtractTextWebpackPlugin({
    filename:'css/less.[hash:8].css',
    disable:true,               // 抽离之后是不能热更新的，所以在开发时禁用
});
let CssExtract=new ExtractTextWebpackPlugin({
    filename:'css/css.[hash:8].css',
    disable:true,
});
let webpack = require('webpack');
module.exports = {

    // 单页'',[]
    // 多页{}	多入口多出口
    // entry: [
    // 	'./src/index.js',
    // 	'./src/a.js'
    // ], 	// 入口,可以写数组
    entry: {
        index: './src/index.js',
    }, 	// 入口,可以写数组
    output: {					// 出口
        filename: '[name].[hash:8].js',		// 点后面也可以跟一串随机数,name代表文件名
        path: `${__dirname}/build`,			// 这里必须是绝对路径
    },
    devServer: {
        contentBase: './dist',				// 打包文件的文件夹
        port: 3000,								// 端口号
        host: 'localhost',						// 域名
        compress: true,						// 服务器压缩
        open: true,								// 自动打开浏览器
        hot: true								// 热更新 引入webpack自带插件 ，不设置的话默认硬更新，就是全部更新，热更新会保留一些状态
    },				// 配置开发服务器
    module: {
        rules: [		// 解析是从右往左进行的，所以先解析成css模块，用style-loader插入到页面中
            // { test: /\.css$/, use: ['style-loader','css-loader'] },
            {
                test: /\.css$/, use: LessExtract.extract({
                    fallback: "style-loader",           // 配合disable,开发的时候还是要放在style中
                    use: [
                        {loader: 'css-loader'}
                    ]
                })
            },
            {
                test: /\.less$/, use: CssExtract.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: 'css-loader'},
                        {loader: 'less-loader'}
                    ]
                })
            },
        ]
    },					// 模块配置
    plugins: [
        LessExtract,
        CssExtract,
        new webpack.HotModuleReplacementPlugin(),	// js代码中新增 if(module.hot){ module.hot.accept() } 实现热更新
        new HtmlWebpackPlugin({
            template: './src/index.html',		    // 打包html插件
            title: '标题文字',
            hash: true,							    // 引入文件的随机数
            chunks: ['index']                      // 对应entry中的json,希望引入那个js
        }),
        new CleanWebpackPlugin(['./dist']),	// 打包时清除 build 文件夹
    ],							// 插件的配置
    mode: 'development',			// 可以更改模式(生产模式和开发模式) production生产模式
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


