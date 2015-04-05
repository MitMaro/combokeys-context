var HtmlWebpackPlugin = require('html-webpack-plugin');
var RewirePlugin = require("rewire-webpack");

module.exports = {
	context: __dirname,
	entry: {
		'tests': [
			'./test/Combokeys-Context-test.js',
			'./test/plugins/StaticPlugin-test.js',
			'./test/plugins/TagCallbackFilter-test.js'
		],
		bootstrap: './mocha-web-bootstrap.js',
		'vendor': ['sinon-chai']
	},
	output: {
		path: __dirname + "/dist",
		filename: "[name].bundle.js",
		chunkFilename: "[id].bundle.js"
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'test/test_runner_template.html'
		}),
		new RewirePlugin()
	]
};

