module.exports = function (grunt) {
	var browsers = [
		{
			browserName: 'chrome',
			platform: 'Windows 7'
		},
		{
			browserName: 'firefox',
			platform: 'Windows 7'
		},
		{
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '10.0'
		},
		{
			browserName: 'internet explorer',
			platform: 'Windows 7',
			version: '11.0'
		}
	];

	grunt.initConfig({
		connect: {
			server: {
				options: {
					base: 'dist/',
					port: 9999
				}
			}
		},
		'saucelabs-mocha': {
			all: {
				options: {
					urls: ['http://127.0.0.1:9999/index.html'],
					tunnelTimeout: 5,
					build: process.env.TRAVIS_JOB_ID,
					concurrency: 3,
					browsers: browsers,
					testname: 'mocha tests',
					'max-duration': 15
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-saucelabs');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('test', ['connect', 'saucelabs-mocha']);
};
