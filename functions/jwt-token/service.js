const jwt = require('jsonwebtoken');
module.exports.generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}