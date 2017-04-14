'use strict';

const istanbul = require('browserify-istanbul');
const isparta = require('isparta');

const karmaBaseConfig = {

	basePath: '../../../',

	singleRun: true,

	frameworks: ['jasmine', 'browserify'],

	preprocessors: {
		'src/main/web/js/**/*.js': ['browserify', 'coverage'],
		'src/test/javascript/**/*.js': ['browserify']
	},

	browsers: ['Chrome'],

	reporters: ['progress'],

	autoWatch: true,

	browserify: {
		debug: true,
		extensions: ['.js'],
		transform: [
			'browserify-css',
			istanbul({
				instrumenter: isparta,
				ignore: ['**/node_modules/**', '**/src/test/javascript/**']
			})
		]
	},

	proxies: {
		'/': 'http://localhost:9876/'
	},

	urlRoot: '/__karma__/',

	files: [
		// app-specific code
		'src/main/web/js/main.js',

		// 3rd-party resources
		'node_modules/angular-mocks/angular-mocks.js',

		// test files
		'src/test/javascript/unit/**/*.js'
	]

};

const customLaunchers = {
	chrome: {
		base: 'SauceLabs',
		browserName: 'chrome'
	}
};

const ciAdditions = {
	sauceLabs: {
		testName: 'Karma Unit Tests',
		startConnect: false,
		build: process.env.TRAVIS_BUILD_NUMBER,
		tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
	},
	browsers: Object.keys(customLaunchers),
	customLaunchers: customLaunchers,
	reporters: ['progress', 'saucelabs']
};

module.exports = function (config) {
	const isCI = process.env.CI && Boolean(process.env.TRAVIS_PULL_REQUEST);
	config.set(isCI ? Object.assign(karmaBaseConfig, ciAdditions) : karmaBaseConfig);
};