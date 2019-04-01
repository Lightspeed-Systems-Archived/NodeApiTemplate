'use strict';
const api = global.api;
api.corsOrigin('*');
api.corsHeaders('Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Api-Version,jwt,customerId');
const apiMap = {};
module.exports.configure = function(verb, path, args, cb) {
  if (typeof(verb) === 'undefined') { throw new Error('verb required');}
  if (typeof(verb) !== 'string') { throw new Error('verb must be a string');}
  if (typeof(path) === 'undefined') { throw new Error('path required');}
  if (typeof(path) !== 'string') { throw new Error('path must be a string');}
  if (typeof(args) === 'undefined') { throw new Error('args required');}
  if (typeof(args) !== 'object') { throw new Error('args must be an object');}
  if (typeof(cb) === 'undefined') { throw new Error('callback required');}
  if (typeof(cb) !== 'function') { throw new Error('callback must be a function');}
  api[verb](path, (request) => {
    return new Promise((resolve, reject) => {
      let customerId;
      try {
        if (!args.ignore_jwt_auth) {
          try {
            const decoded = jwt.verify(request.normalizedHeaders.jwt, process.env.JWT_SECRET);
            request.jwtPayload = decoded;
          } catch (e) {
            RelayLog.error('[documentedApi] err:', e.message + '\n' + e.stack);
            resolve(new api.ApiResponse('Bad JWT', {'Content-Type': 'text/plain'}, 401));
            return;
          }
        }
        if (args.requires_customer_db) {
          if (request.normalizedHeaders.customerid) {
            customerId = request.normalizedHeaders.customerid;
          } else {
            if (typeof(request.jwtPayload) === 'undefined') { throw new Error('customerId required if jwt ignored');}
            customerId = request.jwtPayload.data.cId;
          }

          request.customerId = customerId;
          const db = new Models.CustomerDB(customerId);
          return db.Init().then(() => {
            request.db = db;
            return Promise.all([cb(request)]).then((data) => {
              resolve(data[0]);
            }).catch((e) => {
              reject(e);
            });
          }).catch((e) => {
            RelayLog.error('[documentedApi] err:', e.message + '\n' + e.stack);
            resolve(new api.ApiResponse(e.message, {'Content-Type': 'text/plain'}, 500));
          });
        }
        return Promise.all([cb(request)]).then((data) => {
          resolve(data[0]);
        }).catch((e) => {
          reject(e);
        });
      } catch (e) {
        reject(e);
      }
    }).then((resp) => {
      try {
        if (typeof(request.db) !== 'undefined') {
          request.db.connection.close();
        }
      } catch (error) {
        RelayLog.error('[documentedApi] err:', error.message + '\n' + error.stack);
      }
      return resp;
    }).catch((error) => {
      RelayLog.error('[documentedApi] err:', error.message + '\n' + error.stack);
      try {
        if (typeof(request.db) !== 'undefined') {
          request.db.connection.close();
        }
      } catch (error) {
        RelayLog.error('[documentedApi] err:', error.message + '\n' + error.stack);
      }
      return new api.ApiResponse(error.message, {'Content-Type': 'text/plain'}, 500);
    });
  }, {
    apiKeyRequired: true,
    success: {
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Origin': '*',
      }
    }
  });
  const parts = path.split('/');
  let scope = apiMap;
  parts.forEach((part) => {
    const slashPart = `${part}/`;
    if (!scope[slashPart]) { scope[slashPart] = {};}
    scope = scope[slashPart];
  });
  scope[verb.toUpperCase()] = args;
};
module.exports.fns = {};
module.exports.fns.index = function(request) {
  return apiMap;
};


module.exports.routes = {
  '': { // Index route for this module
    get: {
      docs: {
        desc: 'Lists the configured routes'
      },
      fn: module.exports.fns.index
    }
  }
};
