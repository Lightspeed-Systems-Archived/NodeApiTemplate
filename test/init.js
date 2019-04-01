process.env.RELAY_LOG_LEVEL = undefined;
require('relay-log');
global.assert = require('assert');
global.devRequire = function(path) {
  return require('../' + path);
};
global.devRewire = function(path) {
  return rewire('../' + path);
};
global.rewire = require('rewire');
global.jwt = require('jsonwebtoken');
global.axios = require('axios');
require('relay-models');
const ApiBuilder = require('claudia-api-builder');
global.api = new ApiBuilder();
