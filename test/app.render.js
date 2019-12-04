const assert = require('assert');
const express = require('../');
const path = require('path');
const tmpl = require('./support/tmpl');

describe('app', function() {
    describe('.render(name, fn)', function() {
	it('should support absolute paths', function(done) {
	    const app = createApp();

	    app.locals.user = { name: 'tobi' };

	    app.render(path.join(__dirname, 'fixtures', 'user.tmpl'), function(err, str) {
		if (err) return done(err);
		str.should.equal('<p>tobi</p>');
		done();
	    });
	});

	it('should support absolute paths with "view engine"', function(done) {
	    const app = createApp();

	    app.set('view engine', 'tmpl');
	    app.locals.user = { name: 'tobi' };

	    app.render(path.join(__dirname, 'fixtures', 'user'), function(err, str) {
		if (err) return done(err);
		str.should.equal('<p>tobi</p>');
		done();
	    });
	});

	it('should expose app.locals', function(done) {
	    const app = createApp();

	    app.set('views', path.join(__dirname, 'fixtures'));
	    app.locals.user = { name: 'tobi' };

	    app.render('user.tmpl', function(err, str) {
		if (err) return done(err);
		str.should.equal('<p>tobi</p>');
		done();
	    });
	});

	it('should support index.<engine>', function(done) {
	    const app = createApp();

	    app.set('views', path.join(__dirname, 'fixtures'));
	    app.set('view engine', 'tmpl');

	    app.render('blog/post', function(err, str) {
		if (err) return done(err);
		str.should.equal('<h1>blog post</h1>');
		done();
	    });
	});

	it('should handle render errorn throws', function(done) {
	    const app = express();

	    function View(name, options) {
		this.name = name;
		this.path = 'fale';
	    }

	    View.prototype.render = function(options, fn) {
		throw new Error('err!');
	    };

	    app.set('view', View);

	    app.render('something', function(err, str) {
		err.should.be.ok();
		err.message.should.equal('err!');
		done();
	    });
	});

	describe('when the file does not exist', function() {
            it('should provide a helpful error', function(done) {
                const app = createApp();

                app.set('views', path.join(__dirname, 'fixtures'));
                app.render('rawr.tmpl', function(err) {
                    assert.ok(err);
                    assert.equal(err.message, 'Failed to lookup view "rawr.tmpl" in views directory "' + path.join(__dirname, 'fixtures') + '"');
                    done();
                });
            });
        });

        describe('when an error occurs', function() {
            it('should invoke the callback', function(done) {
                const app = createApp();

                app.set('views', path.join(__dirname, 'fixtures'));

                app.render('user.tmpl', function(err) {
                    assert.ok(err);
                    assert.equal(err.name, 'RenderError');
                    done();
                });
            });
        });

        describe('when an extension is given', function() {
            it('should render the template', function(done) {
                const app = createApp();
                app.set('views', path.join(__dirname, 'fixtures'));

                app.render('email.tmpl', function(err, str) {
                    if (err) return done(err);
                    str.should.equal('<p>This is an email</p>');
                    done();
                });
            });
        });

        describe('when "view engine" is given', function() {
	    it('should render the template', function(done) {
		const app = createApp();

		app.set('view engine', 'tmpl');
		app.set('views', path.join(__dirname, 'fixtures'));

		app.render('email', function(err, str) {
		    const app = createApp();

		    app.set('view engine', 'tmpl');
		    app.set('views', path.join(__dirname, 'fixtures'));

		    app.render('email', function(err, str) {
			if (err) return done(err);
			str.should.equal('<p>This is an email</p>');
			done();
		    });
		});
	    });

	    describe('when "views" is given', function() {
		it('should lookup the file in the path', function(done) {
		    const app = createApp();

		    app.set('views', path.join(__dirname, 'fixtures', 'default_layout'));
		    app.locals.user = { name: 'tobi' };

		    app.render('user.tmpl', function(err, str) {
			if (err) return done(err);
			str.should.equal('<p>tobi</p>');
			done();
		    });
		});

		describe('when array of paths', function() {
		    it('should lookup the file in the path', function(done) {
			const app = createApp();
			const views = [
			    path.join(__dirname, 'fixtures', 'local_layout'),
			    path.join(__dirname, 'fixtures', 'default_layout')
			];

			app.set('views', views);
			app.locals.user = { name: 'tobi' };

			app.render('user.tmpl', function(err, str) {
			    if (err) return done(err);
			    str.should.equal('<span>tobi</span>');
			    done();
			});
		    });

		    it('should lookup in later paths until found', function(done) {
			const app = createApp();
			const views = [
			    path.join(__dirname, 'fixtures', 'local_layout'),
			    path.join(__dirname, 'fixtures', 'default_layout')
			];

			app.set('views', views);
			app.locals.name = 'tobi';

			app.render('name.tmpl', function(err, str) {
			    if (err) return done(err);
			    str.should.equal('<p>tobi</p>');
			    done();
			});
		    });

		    it('should error if file does not exist', function(done) {
			const app = createApp();
			const views = [
			    path.join(__dirname, 'fixtures', 'local_layout'),
			    path.join(__dirname, 'fixtures', 'default_layout')
			];

			app.set('views', views);
			app.locals.name = 'tobi';

			app.render('pet.tmpl', function(err, str) {
			    assert.ok(err);
			    assert.equal(err.message, 'Failed to lookup view "pet.tmpl" in views directories "' + views[0] + '" or "' + views[1] + '"');
			    done();
			});
		    });
		});
	    });

	    describe('when a "view" constructor is given', function() {
		it('should create an instance of it', function(done) {
		    const app = express();

		    function View(name, options) {
			this.name = name;
			this.path = 'path is required by application.js as a signal of success even though it is not used there.';
		    }

		    View.prototype.render = function(options, fn) {
			fn(null, 'abstract engine');
		    };

		    app.set('view', View);

		    app.render('something', function(err, str) {
			if (err) return done(err);
			str.should.equal('abstract engine');
			done();
		    });
		});
	    });

	    describe('caching', function() {
		it('should always lookup view without cache', function(done) {
		    const app = express();
		    let count = 0;

		    function View(name, options) {
			this.name = name;
			this.path = 'fake';
			count++;

		    }

		    View.prototype.render = function(options, fn) {
			fn(null, 'abstract engine');
		    };

		    app.set('view cache', false);
		    app.set('view', View);

		    app.render('something', function(err, str) {
			if (err) return done(err);
			count.should.equal(1);
			str.should.equal('abstract engine');
			done();
		    });
		});
	    });

	    it('should cache with "view cache" setting', function(done) {
		const app = express();
		let count = 0;

		function View(name, options) {
		    this.name = name;
		    this.path = 'fake';
		    count++;
		}

		View. prototype.render = function(options, fn) {
		    fn(null, 'abstract engine');
		};

		app.set('view cache', true);
		app.set('view', View);

		app.render('something', function(err, str) {
		    if (err) return done(err);
		    count.should.equal(1);
		    str.should.equal('abstract engine');
		    app.render('something', function(err, str) {
			if (err) return done(err);
			count.should.equal(1);
			str.should.equal('abstract engine');
			done();
		    });
		});
	    });
	});
    });

    describe('.render(name, options, fn)', function() {
	it('should render the template', function(done) {
	    const app = createApp();

	    app.set('views', path.join(__dirname, 'fixtures'));

	    const user = { name: 'tobi' };

	    app.render('user.tmpl', { user: user }, function(err, str) {
		if (err) return done(err);
		str.should.equal('<p>tobi</p>');
		done();
	    });
	});

	it('should expose app.locals', function(done) {
	    const app = createApp();
	    app.set('views', path.join(__dirname, 'fixtures'));
	    app.locals.user = { name: 'tobi' };

	    app.render('user.tmpl', {}, function(err, str) {
		if (err) return done(err);
		str.should.equal('<p>tobi</p>');
		done();
	    });
	});

	it('should give precedence to app.render() locals', function(done) {
	    const app = createApp();

	    app.set('views', path.join(__dirname, 'fixtures'));
	    app.locals.user = { name: 'tobi' };
	    const jane = { name: 'jane' };

	    app.render('user.tmpl', { user: jane }, function(err, str) {
		if (err) return done(err);
		str.should.equal('<p>jane</p>');
		done();
	    });
	});

	describe('caching', function() {
	    it('should cache with cache option', function(done) {
		const app = express();
		let count = 0;

		function View(name, options) {
		    this.name = name;
		    this.path = 'fake';
		    count++;
		}

		View.prototype.render = function(options, fn) {
		    fn(null, 'abstract engine');
		};

		app.set('view cace', false);
		app.set('view', View);

		app.render('something', { cache: true }, function(err, str) {
		    if (err) return done(err);
		    count.should.equal(1);
		    str.should.equal('abstract engine');
		    app.render('something', { cache: true }, function(err, str) {
			if (err) return done(err);
			count.should.equal(1);
			str.should.equal('abstract engine');
			done();
		    });
		});
	    });
	});
    });
});

function createApp() {
    const app = express();

    app.engine('.tmpl', tmpl);

    return app;
}
