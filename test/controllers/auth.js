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
        it('should return an error if no request object', async () => {
          const data = await Auth.routes[''].post.fn();
          assert.deepEqual(
            data,
            {error: 'request must be defined', type: 'bad params'}
          );
        });
        it('should return an error if no jsonBody is passed', async () => {
          const data = await Auth.routes[''].post.fn({});
          assert.deepEqual(
            data,
            {error: 'jsonBody required', type: 'bad params'}
          );
        });
        it('should return an error if the body is not an object', async () => {
          const data = await Auth.routes[''].post.fn({body: 123});
          assert.deepEqual(
            data,
            {error: 'jsonBody required', type: 'bad params'}
          );
        });
        it('should return an error if no username is passed', async () => {
          const data = await Auth.routes[''].post.fn({body: {}});
          assert.deepEqual(
            data,
            {error: 'username required', type: 'bad params'}
          );
        });
        it('should return an error if username is not a string', async () => {
          const data = await Auth.routes[''].post.fn({body: {username: 1}});
          assert.deepEqual(
            data,
            {error: 'username must be a string', type: 'bad params'}
          );
        });
        it('should return an error if no password is passed', async () => {
          const data = await Auth.routes[''].post.fn({body: {username: 'test'}});
          assert.deepEqual(
            data,
            {error: 'password required', type: 'bad params'}
          );
        });
        it('should return an error if password is not a string', async () => {
          const data = await Auth.routes[''].post.fn({body: {username: 'test', password: 1}});
          assert.deepEqual(
            data,
            {error: 'password must be a string', type: 'bad params'}
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
          it('should return an error if no request is passed', async () => {
            const data = await Auth.routes.google_callback.post.fn();
            assert.deepEqual(
              data,

              {error: 'request must be defined', type: 'bad params'}
            );
          });
          it('should return an error if there is no code', async () => {
            const data = await Auth.routes.google_callback.post.fn({db: {}, body: {}});
            assert.deepEqual(
              data,

              {error: 'code must be a string', type: 'bad params'}
            );
          });
          it('should return an error if there is no redirect_url', async () => {
            const data = await Auth.routes.google_callback.post.fn({db: {}, body: {code: 'abc'}});
            assert.deepEqual(
              data,

              {error: 'redirect_url must be a string', type: 'bad params'}
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
          it('should return an error if no request is passed', async () => {
            const data = await Auth.routes.azure_callback.post.fn();
            assert.deepEqual(
              data,
              {error: 'request must be defined', type: 'bad params'}
            );
          });
          it('should return an error if there is no code', async () => {
            const data = await Auth.routes.azure_callback.post.fn({db: {}, body: {}});
            assert.deepEqual(
              data,
              {error: 'code must be a string', type: 'bad params'}
            );
          });
          it('should return an error if there is no redirect_url', async () => {
            const data = await Auth.routes.azure_callback.post.fn({db: {}, body: {code: 'abc'}});
            assert.deepEqual(
              data,
              {error: 'redirect_url must be a string', type: 'bad params'}
            );
          });
        });
      });
    });
  });
});
