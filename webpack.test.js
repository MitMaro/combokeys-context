var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname,
	entry: {
		'tests': [
			'./test/Combokeys-Context-test.js',
			'./test/util/isArray-test.js'
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
		})
	]
};


