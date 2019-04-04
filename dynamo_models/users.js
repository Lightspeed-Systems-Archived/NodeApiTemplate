const sha512 = require('js-sha512');
function getUser(email, password) {
  const params = {
    Key: {
      email: {
        S: email.toLowerCase()
      },
    },
    TableName: `users-${process.env.LAMBDA_ENV}`,
  };

  return new Promise((resolve, reject) => {
    dynamo.getItem(params, (err, data) => {
      let isAuthenticated = true;

      if (err || !data.Item) {
        RelayLog.error(err);

        reject({
          customMessage: 'invalid username / password',
          email,
          ...err
        });
        return;
      }

      if (password !== undefined) {
        isAuthenticated = authenticate(password, data);
      }


      const user = {
        email: data.Item.email ? data.Item.email.S : undefined,
        guid: data.Item.guid ? data.Item.guid.S : undefined,
        is_admin: data.Item.is_admin ? parseInt(data.Item.is_admin.N, 10) : undefined,
        first_name: data.Item.first_name ? data.Item.first_name.S : undefined,
        group_ids: data.Item.group_ids ? data.Item.group_ids.NS : undefined,
        user_type: data.Item.user_type ? data.Item.user_type.N : undefined,
        last_name: data.Item.last_name ? data.Item.last_name.S : undefined,
        is_lightspeed_admin: data.Item.is_admin && data.Item.is_admin >= 80,
        customer_id: data.Item.customer_id ? data.Item.customer_id.S : undefined,
      };

      if (isAuthenticated) {
        resolve(user);
      } else {
        reject({
          customMessage: 'invalid username / password',
          email,
          ...err
        });
      }
    });
  });
};

function authenticate(password, user) {
  const passwordSalt = user.Item.password_salt ? user.Item.password_salt.S : undefined;
  let digest = `${password}${passwordSalt}`;

  for (let i = 0; i < 20; i++) {
    digest = sha512(digest);
  }

  return (
    passwordSalt &&
    user.Item.encrypted_password &&
    user.Item.encrypted_password.S === digest &&
    user.Item.user_type &&
    user.Item.user_type.N === 2
  );
}

exports.getUser = getUser;