const express = require('../');
const request = require('supertest');

describe('res', function() {
    describe('.type(str)', function() {
	it('should set the Content-Type based on a filename', function(done) {
	    const app = express();

	    app.use(function(req, res) {
		res.type('foo.js').end('const name = "tj";');
	    });

	    request(app)
		.get('/')
		.expect('Content-Type', 'application/javascript; charset=utf-8')
		.end(done);
	});

	it('should default to application/octet-stream', function(done) {
	    const app = express();

	    app.use(function(req, res) {
		res.type('rawr').end('const name = "tj";');
	    });

	    request(app)
		.get('/')
		.expect('Content-Type', 'application/octet-stream', done);
	});

	it('should set the Content-Type with type/subtype', function(done) {
	    const app = express();

	    app.use(function(req, res) {
		res.type('application/vnd.amazon.ebook')
		    .end('const name = "tj";');
	    });

	    request(app)
		.get('/')
		.expect('Content-Type', 'application/vnd.amazon.ebook', done);
	});
    });
});
