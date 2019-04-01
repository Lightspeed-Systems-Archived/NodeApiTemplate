require('../init');
describe('Controllers/Routes', () => {
  const Routes = devRequire('controllers/routes');
  describe('Exports', () => {
    describe('configure', () => {
      it('should be a function', () => {
        assert.equal(
          typeof(Routes.configure),
          'function'
        );
      });
      it('should throw an error if no verb is passed', () => {
        assert.throws(
          Routes.configure,
          /verb required/
        );
      });
      it('should throw an error if verb is not a string', () => {
        assert.throws(
          Routes.configure.bind(null, 1),
          /verb must be a string/
        );
      });
      it('should throw an error if no path is passed', () => {
        assert.throws(
          Routes.configure.bind(null, 'get'),
          /path required/
        );
      });
      it('should throw an error if path is not a string', () => {
        assert.throws(
          Routes.configure.bind(null, 'get', 1),
          /path must be a string/
        );
      });
      it('should throw an error if no args is passed', () => {
        assert.throws(
          Routes.configure.bind(null, 'get', 'index'),
          /args required/
        );
      });
      it('should throw an error if args is not an object', () => {
        assert.throws(
          Routes.configure.bind(null, 'get', 'index', false),
          /args must be an object/
        );
      });
      it('should throw an error if no callback is passed', () => {
        assert.throws(
          Routes.configure.bind(null, 'get', 'index', {}),
          /callback required/
        );
      });
      it('should throw an error if callback is not a function', () => {
        assert.throws(
          Routes.configure.bind(null, 'get', 'index', {}, 1),
          /callback must be a function/
        );
      });
    });

    describe('fns', () => {
      it('should be an object', () => {
        assert.equal(
          typeof(Routes.fns),
          'object'
        );
      });
      it('should define index as a function', () => {
        assert.equal(
          typeof(Routes.fns.index),
          'function'
        );
      });
    });

    describe('routes', () => {
      it('should be an object', () => {
        assert.equal(
          typeof(Routes.routes),
          'object'
        );
      });
      it('should define the root route \'\'', () => {
        assert.equal(
          typeof(Routes.routes['']),
          'object'
        );
        assert.equal(
          typeof(Routes.routes[''].get),
          'object'
        );
        assert.equal(
          typeof(Routes.routes[''].get.docs),
          'object'
        );
        assert.equal(
          Routes.routes[''].get.docs.desc,
          'Lists the configured routes'
        );
        assert.equal(
          typeof(Routes.routes[''].get.fn),
          'function'
        );
      });
    });
  });
});
