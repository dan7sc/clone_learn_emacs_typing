const express = require('..');
const request = require('supertest');

describe('app', function() {
    describe('.request', function() {
	it('should extend the request prototype', function(done) {
	    const app = express();

	    app.request.querystring = function() {
		return require('url').parse(this.url).query;
	    };

	    app.use(function(req, res) {
		res.end(req.querystring());
	    });

	    request(app)
		.get('/foo?name=tobi')
		.expect('name=tobi', done);
	});
    });
});
