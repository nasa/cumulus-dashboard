// Helper code to generate and verify tokens in cypress tests.
const jwt = require('jsonwebtoken');

const tokenSecret = 'secret';
function generateJWT (options = { expiresIn: 30 }) {
  return jwt.sign({
    data: 'fake-token'
  }, tokenSecret, options);
}

function verifyJWT (token, params) {
  params = params || {};
  const options = Object.assign({}, params);
  jwt.verify(token, tokenSecret, options);
}

module.exports = {
  generateJWT,
  verifyJWT
};
