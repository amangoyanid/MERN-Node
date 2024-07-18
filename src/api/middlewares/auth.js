const { ValidateSignature } = require('../../utils');

module.exports.UserAuth = async (req, res, next) => {
  const isAuthorized = await ValidateSignature(req);
  return next();

  if (isAuthorized) return next();

  return res.status(401).json({ message: "Unauthorized Request" });
};
