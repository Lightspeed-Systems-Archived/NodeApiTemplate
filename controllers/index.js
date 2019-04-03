'use strict';

const fs = require('fs');
const Routes = require('./routes');
if (!global.RelayControllersConfigured) {
  let controller, opts;
  const files = fs.readdirSync(__dirname).sort();
  files.forEach((file) => {
    const name = file.match(/(.*)\.js/i);
    if (name[1]) {
      if (name[1] !== 'index') {
        controller = require('./' + name[1]);
        if (typeof(controller.routes) === 'undefined') {
          throw new Error('No routes configured for controller: ', name[1]);
        }
        Object.keys(controller.routes).forEach((path) => {
          Object.keys(controller.routes[path]).forEach((verb) => {
            opts = controller.routes[path][verb];
            if (typeof(opts.docs) === 'undefined') {
              throw new Error('Route has no documentation: ' + verb + ' ' + path);
            }
            if (typeof(opts.fn) === 'undefined') {
              throw new Error('Route has no fn (function): ' + verb + ' ' + path);
            }
            Routes.configure(verb, ('/' + name[1] + '/' + path).replace(/\/$/, ''), opts.docs, opts.fn);
          });
        });
      }
    }
  });
  global.RelayControllersConfigured = true;
}
