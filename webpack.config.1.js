// 遵循commonjs规范
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
	entry: './src/index.js', 	// 入口
	output: {					// 出口
		filename: 'build.[hash:8].js',	// 点后面也可以跟一串随机数
		path: `${__dirname}/build`			// 这里必须是绝对路径
	},
	devServer: {
		contentBase: './build',				// 打包文件的文件夹
		port: 3000,							// 端口号				
		compress: true,						// 服务器压缩
		open: true,							// 自动打开浏览器
	},				// 配置开发服务器
	module: {},					// 模块配置
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',		// 打包html插件
			title: '标题文字',
			hash: true,							// 引入文件的随机数
			// minify: {
			// 	removeAttributeQutes: true,		// 删除属性的引号
			// 	collapseWhitespace: true,		// 折叠控行
			// }
		}),
		new CleanWebpackPlugin(['./build']),	// 打包时清除 build 文件夹
	],							// 插件的配置
	mode: 'development',			// 可以更改模式(生产模式和开发模式) production生产模式
	resolve: {}					// 配置解析
}

// 1.在webpack中如何配置开发服务器 安装模块webpack-dev-server
// 2.webpack插件 将html打包到build中可以自动引入生产的JS 安装模块html-webpack-plugin
// 每次打包都会产生新的文件，我们需要先删除旧的文件，在打包新的文件 安装插件clean-webpack-plugin




