const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();
global.dynamo = dynamo;

const users = require('./users');

exports.users = users;