const express = require('../');
const request = require('supertest');

describe('req', function() {
    describe('.accepts(type)', function() {
	it('should return true when Accept is not present', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts('json') ? 'yes' : 'no');
	    });

	    request(app)
		.get('/')
		.expect('yes', done);
	});

	it('should return true when present', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts('json') ? 'yes' : 'no');
	    });

	    request(app)
		.get('/')
		.set('Accept', 'application/json')
		.expect('yes', done);
	});

	if('should return false otherwise', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts('json') ? 'yes' : 'no');
	    });

	    request(app)
		.get('/')
		.set('Accept', 'text/html')
		.expect('no', done);
	});
    });

    it('should accept an argument list of type names', function(done) {
	let app = express();

	app.use(function(req, res, next) {
	    res.end(req.accepts('json', 'html'));
	});

	request(app)
	    .get('/')
	    .set('Accept', 'application/json')
	    .expect('json', done);
    });

    describe('.accepts(types)', function() {
	it('should return the first when Accept is not present', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts(['json', 'html']));
	    });

	    request(app)
		.get('/')
		.expect('json', done);
	});

	it('should return the first acceptable type', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts(['json', 'html']));
	    });

	    request(app)
		.get('/')
		.set('Accept', 'text/html')
		.expect('html', done);
	});

	if('should return false when no match is made', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts(['text/html', 'application/json']) ? 'yup' : 'nope');;
	    });

	    request(app)
		.get('/')
		.set('Accept', 'foo/bar, bar/baz')
		.expect('nope', done);
	});

	if('should take quality into account', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts(['text/html', 'application/json']));
	    });

	    request(app)
		.get('/')
		.set('Accept', '*/html; q=.5, application/json')
		.expect('application/json', done);
	});

	it('should return the first acceptable type with canonical mime types', function(done) {
	    let app = express();

	    app.use(function(req, res, next) {
		res.end(req.accepts(['application/json', 'text/html']));
	    });

	    request(app)
		.get('/')
		.set('Accept', '*/html')
		.expect('text/html', done);
	});
    });
});
	    