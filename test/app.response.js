const express = require('../');
const request = require('supertest');

describe('app', function() {
    describe('.response', function() {
	it('should extend the response prototype', function(done) {
	    const app = express();

	    app.response.shout = function(str) {
		this.send(str.toUpperCase());
	    };

	   app.use(function(req, res) {
	       res.shout('hey');
	   });

	   request(app)
	   .get('/')
	   .expect('HEY', done);
	  });

	it('should not be influenced by other app protos', function(done) {
	    const app = express();
	    const app2 = express();
	    
	    app.response.shout = function(str) {
		this.send(str.toUpperCase());
	    };

	    app2.response.shout = function(str) {
		this.send(str);
	    };
	    
	    app.use(function(req, res) {
		res.shout('hey');
	    });

	    request(app)
		.get('/')
		.expect('HEY', done);
	});
    });
});
