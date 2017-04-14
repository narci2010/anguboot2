'use strict';

describe('Unit: _example', function () {

	let http, service;

	var resp = {
		title: 'My title'
	};

	beforeEach(function () {
		// instantiate the app module
		angular.mock.module('<%=name%>');

		// mock the service
		angular.mock.inject(($httpBackend, _example) => {
			http = $httpBackend;
			service = _example;
		});
	});

	it('Service should be defined', function () {
		expect(service).toBeDefined();
	});

	it('Service should retrieve data correctly', function (done) {
		http.expect('GET', '/api/welcome').respond(200, {
			data: resp
		});

		service.welcome().then((result) => {
			expect(result.data).toEqual({
				data: resp
			});
		}).catch((error) => {
			expect(error).toBeUndefined();
		}).then(done);

		http.flush();
	});
});