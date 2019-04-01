require('../init');
describe('Controllers/Auth', () => {
  const Auth = devRequire('controllers/auth');
  describe('routes', () => {
    it('should be an object', () => {
      assert.equal(
        typeof(Auth.routes),
        'object'
      );
    });
    describe('/', () => {
      it('definition', () => {
        assert.equal(
          typeof(Auth.routes['']),
          'object'
        );
      });
      describe('POST', () => {
        it('definition', () => {
          assert.equal(
            typeof(Auth.routes[''].post),
            'object'
          );
          assert.equal(
            typeof(Auth.routes[''].post.fn),
            'function'
          );
        });
        describe('documentation', () => {
          it('definition', () => {
            assert.equal(
              typeof(Auth.routes[''].post.docs),
              'object'
            );
          });
          it('description', () => {
            assert.equal(
              Auth.routes[''].post.docs.desc,
              'attempts to authenticate a user'
            );
          });
          describe('jsonBody', () => {
            it('definition', () => {
              assert.equal(
                typeof(Auth.routes[''].post.docs.jsonBody),
                'object'
              );
            });
            it('username', () => {
              assert.deepEqual(
                Auth.routes[''].post.docs.jsonBody.username,
                {
                  optional: false,
                  type: 'string'
                }
              );
            });
            it('password', () => {
              assert.deepEqual(
                Auth.routes[''].post.docs.jsonBody.password,
                {
                  optional: false,
                  type: 'string'
                }
              );
            });
          });
        });
        it('should throw an error if no request object', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null),
            /request must be defined/
          );
        });
        it('should throw an error if no jsonBody is passed', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null, {}),
            /jsonBody required/
          );
        });
        it('should throw an error if the body is not an object', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null, {body: 123}),
            /jsonBody required/
          );
        });
        it('should throw an error if no username is passed', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null, {body: {}}),
            /username required/
          );
        });
        it('should throw an error if username is not a string', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null, {body: {username: 1}}),
            /username must be a string/
          );
        });
        it('should throw an error if no password is passed', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null, {body: {username: 'test'}}),
            /password required/
          );
        });
        it('should throw an error if password is not a string', () => {
          assert.throws(
            Auth.routes[''].post.fn.bind(null, {body: {username: 'test', password: 1}}),
            /password must be a string/
          );
        });
      });
    });
    describe('/google_callback', () => {
      describe('POST', () => {
        it('definition', () => {
          assert.equal(
            typeof(Auth.routes.google_callback.post),
            'object'
          );
          assert.equal(
            typeof(Auth.routes.google_callback.post.fn),
            'function'
          );
        });
        describe('documentation', () => {
          it('definition', () => {
            assert.equal(
              typeof(Auth.routes.google_callback.post.docs),
              'object'
            );
          });
          it('ignore_jwt_auth', () => {
            assert.equal(
              Auth.routes.google_callback.post.docs.ignore_jwt_auth,
              true
            );
          });
          it('description', () => {
            assert.equal(
              Auth.routes.google_callback.post.docs.desc,
              'logs in via google oauth'
            );
          });
          describe('jsonBody', () => {
            it('definition', () => {
              assert.equal(
                typeof(Auth.routes.google_callback.post.docs.jsonBody),
                'object'
              );
            });
            it('code', () => {
              assert.deepEqual(
                Auth.routes.google_callback.post.docs.jsonBody.code,
                {optional: false, type: 'string', desc: 'code from google oauth'}
              );
            });
            it('redirect_url', () => {
              assert.deepEqual(
                Auth.routes.google_callback.post.docs.jsonBody.redirect_url,
                {optional: false, type: 'string', desc: 'url to redirect to'}
              );
            });
          });
        });
        describe('validations', () => {
          it('should throw an error if no request is passed', () => {
            assert.throws(
              Auth.routes.google_callback.post.fn,
              /request must be defined/
            );
          });
          it('should throw an error if there is no code', () => {
            assert.throws(
              Auth.routes.google_callback.post.fn.bind(null, {db: {}, body: {}}),
              /code must be a string/
            );
          });
          it('should throw an error if there is no redirect_url', () => {
            assert.throws(
              Auth.routes.google_callback.post.fn.bind(null, {db: {}, body: {code: 'abc'}}),
              /redirect_url must be a string/
            );
          });
        });
      });
    });
    describe('/azure_callback', () => {
      describe('POST', () => {
        it('definition', () => {
          assert.equal(
            typeof(Auth.routes.azure_callback.post),
            'object'
          );
          assert.equal(
            typeof(Auth.routes.azure_callback.post.fn),
            'function'
          );
        });
        describe('documentation', () => {
          it('definition', () => {
            assert.equal(
              typeof(Auth.routes.azure_callback.post.docs),
              'object'
            );
          });
          it('ignore_jwt_auth', () => {
            assert.equal(
              Auth.routes.azure_callback.post.docs.ignore_jwt_auth,
              true
            );
          });
          it('description', () => {
            assert.equal(
              Auth.routes.azure_callback.post.docs.desc,
              'logs in via azure oauth'
            );
          });
          describe('jsonBody', () => {
            it('definition', () => {
              assert.equal(
                typeof(Auth.routes.azure_callback.post.docs.jsonBody),
                'object'
              );
            });
            it('code', () => {
              assert.deepEqual(
                Auth.routes.azure_callback.post.docs.jsonBody.code,
                {optional: false, type: 'string', desc: 'code from azure oauth'}
              );
            });
            it('redirect_url', () => {
              assert.deepEqual(
                Auth.routes.azure_callback.post.docs.jsonBody.redirect_url,
                {optional: false, type: 'string', desc: 'url to redirect to'}
              );
            });
          });
        });
        describe('validations', () => {
          it('should throw an error if no request is passed', () => {
            assert.throws(
              Auth.routes.azure_callback.post.fn,
              /request must be defined/
            );
          });
          it('should throw an error if there is no code', () => {
            assert.throws(
              Auth.routes.azure_callback.post.fn.bind(null, {db: {}, body: {}}),
              /code must be a string/
            );
          });
          it('should throw an error if there is no redirect_url', () => {
            assert.throws(
              Auth.routes.azure_callback.post.fn.bind(null, {db: {}, body: {code: 'abc'}}),
              /redirect_url must be a string/
            );
          });
        });
      });
    });
  });
});
