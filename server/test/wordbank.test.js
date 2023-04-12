/*
* Test the wordbank API and also the database 
*/

import axios from "axios";
import assert from "assert";

describe('Test - Get wordbankname', function () {
	it('should get all valid wordbank name', function (done) {
		let data = '';
		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'http://localhost:3001/wordbank/Cfg7d8ZoyzZeYHUzBn9FjrYaNvW2',
			headers: {},
			data: data
		};


		axios.request(config)
			.then((response) => {
				assert.ok(JSON.stringify(response.data).includes('fruits'), 'The array does not contain fruits__GLOBAL');
				assert.ok(JSON.stringify(response.data).includes('animals'), 'The array does not contain animals__GLOBAL');
				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});

describe('Test - Get wordbank Content', function () {
	it('should get all contents from wordbank', function (done) {

		let data = '';

		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'http://localhost:3001/wordbankcontent/fruits__GLOBAL',
			headers: {},
			data: data
		};

		axios.request(config)
			.then((response) => {
				assert.ok(JSON.stringify(response.data).includes('Watermelon'), 'The array does not contain Watermelon');
				assert.ok(JSON.stringify(response.data).includes('Apple'), 'The array does not contain Apple');
				assert.ok(JSON.stringify(response.data).includes('Plum'), 'The array does not contain Plum');
				assert.ok(JSON.stringify(response.data).includes('Kiwi'), 'The array does not contain Kiwi');

				done();
			})
			.catch((error) => {
				done(error);
			});
	});
});

describe('Test - Get wordbank Content with wrong name', function () {
	it('should not get wordbank content', function (done) {

		let data = '';

		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'http://localhost:3001/wordbankcontent/WrongName',
			headers: {},
			data: data
		};

		axios.request(config)
			.then((response) => {
				done();
			})
			.catch((error) => {
				assert.ok(error.response.status == 404, 'Correct');
				done();
			});
	});
});



describe('Test - create wordbank', function () {
	it('should create a new wordbank', function (done) {
		const words = ['Apple', 'Banana'];
		const config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'http://localhost:3001/wordbank/test/tsboT4GKjRSrfbIpJqeaQG41FlY2',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				words: words
			}
		};

		axios.request(config)
			.then(response => {
				// Check if the response has a status code of 200
				assert.equal(response.status, 200);
				done();
			})
			.catch(error => {
				done(error);
			});
	});

	it('should get the wordbankname test__tsboT4GKjRSrfbIpJqeaQG41FlY2', function (done) {
		let data = '';
		let config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'http://localhost:3001/wordbank/tsboT4GKjRSrfbIpJqeaQG41FlY2',
			headers: {},
			data: data
		};


		axios.request(config)
			.then((response) => {
				assert.ok(JSON.stringify(response.data).includes('test'), 'The array does not contain test__tsboT4GKjRSrfbIpJqeaQG41FlY2');
				done();
			})
			.catch((error) => {
				done(error);
		});
	});

});


describe('Test - delete wordbank', function () {
	it('should delete test wordbank', function (done) {

		let datadelete = '';

		let configdelete = {
			method: 'delete',
			maxBodyLength: Infinity,
			url: 'http://localhost:3001/wordbank/test/tsboT4GKjRSrfbIpJqeaQG41FlY2',
			headers: {},
			data: datadelete
		};

		axios.request(configdelete)
			.then(response => {
				// Check if the response has a status code of 200
				assert.equal(response.status, 200);
				done();
			})
			.catch(error => {
				done(error);
			});
	});
});
