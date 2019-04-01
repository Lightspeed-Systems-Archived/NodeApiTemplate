const JWT_VALID_SECONDS = 14 * 24 * 60 * 60; //14 days
const ONE_HOUR = 60 * 60;

const FormData = require('form-data');
const Sequelize = require('sequelize');
const Base64 = require('base-64');
const Op = Sequelize.Op;

//
// * AUTH CHALLENGE
// Called for normal username/password login
//
const authChallenge = function(request) {
  if (typeof(request) === 'undefined') { throw new Error('request must be defined');}
  if (typeof(request.body) !== 'object' || !request.body) {
    throw new Error('jsonBody required');
  }
  const params = request.body;
  if (typeof(params.username) === 'undefined') { throw new Error('username required');}
  if (typeof(params.username) !== 'string') { throw new Error('username must be a string');}
  if (typeof(params.password) === 'undefined') { throw new Error('password required');}
  if (typeof(params.password) !== 'string') { throw new Error('password must be a string');}

  const authenticateOptions = {
    userEmail: params.username,
    jwt: request.normalizedHeaders.jwt,
  };

  return authenticateUser(authenticateOptions);
};

//
// * JWT CHECK
// Called to authenticate a JWT token (usually on load of UI)
//
const jwtCheck = function(request) {
  if (typeof(request.db) === 'undefined') { throw new Error('request must have a db object');}

  const authenticateOptions = {
    userEmail: request.jwtPayload.data.uEmail,
    customerId: request.jwtPayload.data.cId,
    jwt: request.normalizedHeaders.jwt,
  };

  return authenticateUser(authenticateOptions);
};

//
// * GOOGLE OAUTH CALLBACK
// handles logging in with Google
//
const googleOauthCallback = async function(request) {
  if (typeof(request) === 'undefined') { throw new Error('request must be defined');}
  if (typeof(request.body.code) !== 'string') { throw new Error('code must be a string');}
  if (typeof(request.body.redirect_url) !== 'string') { throw new Error('redirect_url must be a string');}
  const params = [
    'client_id=250992307284-m88p8nub2ormiak916etcu4ke3o850it.apps.googleusercontent.com',
    `client_secret=${process.env.GOOGLE_SECRET}`,
    `redirect_uri=${request.body.redirect_url}`,
    'grant_type=authorization_code',
    `code=${request.body.code}`
  ];

  let googleResponse;

  try {
    googleResponse = await axios.post('https://accounts.google.com/o/oauth2/token', params.join('&'), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (error) {
    return handleError(error, 'googleOauthResponse');
  }

  const decodedIdToken = jwt.decode(googleResponse.data.id_token);

  const authenticateOptions = {
    userEmail: decodedIdToken.email,
  };

  return authenticateUser(authenticateOptions);
};

//
// * AZURE OAUTH CALLBACK
// Handles logging in with Office365
//
const azureOauthCallback = async function(request) {
  if (typeof(request) === 'undefined') { throw new Error('request must be defined');}
  if (typeof(request.body.code) !== 'string') { throw new Error('code must be a string');}
  if (typeof(request.body.redirect_url) !== 'string') { throw new Error('redirect_url must be a string');}
  const params = [
    `client_id=${process.env.AZURE_CLIENT_ID}`,
    `client_secret=${process.env.AZURE_CLIENT_SECRET}`,
    'resource=https://graph.windows.net/',
    `redirect_uri=${request.body.redirect_url}`,
    'grant_type=authorization_code',
    `code=${request.body.code}`
  ];

  let azureResponse;

  try {
    azureResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/token', params.join('&'), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (error) {
    return handleError(error, 'azureOauthResponse');
  }

  const decodedIdToken = jwt.decode(azureResponse.data.id_token);

  const authenticateOptions = {
    userEmail: decodedIdToken.upn,
  };

  return authenticateUser(authenticateOptions);
};

//
// ! PRIVATE METHODS
// ! THESE WILL NOT BE CALLED DIRECTLY FROM A ROUTE
//

//
// * AUTHENTICATE USER
// This actually grabs a user and crafts the API response
//
const authenticateUser = async function(options) {
  const { userEmail, password, customerId, previousJwt, redirectUrl } = options;
  let user;

  try {
    user = await DynamoDB.users.getUser(userEmail.toLowerCase(), password);
  } catch (error) {
    return handleError(error, 'authenticateUser');
  }

  const newJWT = previousJwt ? previousJwt : jwt.sign({
    data: {
      cId: customerId,
      uEmail: user.email,
      u_cId: user.customer_id,
    }
  }, process.env.JWT_SECRET, { expiresIn: JWT_VALID_SECONDS });

  return {
    jwt: newJWT,
    serial: customerId,
    user: user,
    redirectUrl: redirectUrl,
  };
};

//
// * HANDLE ERROR
// Logs the error to Cloudwatch and crafts the API response
//
const handleError = function(error, type) {
  RelayLog.error(`[Err] auth - ${type}`, error);
  if (error && error.response && error.response.data) {
    return {
      error: error.response.data.error,
      message: error.response.data.error_description || error.toString(),
      type: type
    };
  }

  return {
    error: 'unknown',
    message: error,
    type: type
  };
};

module.exports.routes = {
  '': {
    post: {
      docs: {
        ignore_jwt_auth: true,
        desc: 'attempts to authenticate a user',
        jsonBody: {
          username: {optional: false, type: 'string'},
          password: {optional: false, type: 'string'}
        }
      },
      fn: authChallenge
    }
  },
  jwt_check: {
    get: {
      docs: {
        requires_customer_db: true,
        desc: 'checks for authentic jwt'
      },
      fn: jwtCheck
    }
  },
  google_callback: {
    post: {
      docs: {
        ignore_jwt_auth: true,
        desc: 'logs in via google oauth',
        jsonBody: {
          code: {optional: false, type: 'string', desc: 'code from google oauth'},
          redirect_url: {optional: false, type: 'string', desc: 'url to redirect to'},
        },
      },
      fn: googleOauthCallback
    },
  },
  azure_callback: {
    post: {
      docs: {
        ignore_jwt_auth: true,
        desc: 'logs in via azure oauth',
        jsonBody: {
          code: {optional: false, type: 'string', desc: 'code from azure oauth'},
          redirect_url: {optional: false, type: 'string', desc: 'url to redirect to'},
        },
      },
      fn: azureOauthCallback
    },
  },
};
