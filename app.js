'use strict';
require('relay-log');

const ApiBuilder = require('claudia-api-builder');
global.api = new ApiBuilder();
global.jwt = require('jsonwebtoken');
global.axios = require('axios');
global.DynamoDB = require('./dynamo_models');

require('./controllers');
module.exports = global.api;
