require('dotenv').config();

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};