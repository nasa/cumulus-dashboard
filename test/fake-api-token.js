const jwt = require('jsonwebtoken');

const tokenSecret = 'secret';
// let token;
function generateJWT (params) {
  params = params || {};
  const options = Object.assign({
    expiresIn: 10
  }, params);
  return jwt.sign({
    data: 'fake-token'
  }, tokenSecret, options);
}

module.exports = {
  generateJWT
};
