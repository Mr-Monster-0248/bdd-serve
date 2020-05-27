const jwt = require('jsonwebtoken');

const isSignedIn = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send('Invalid TOKEN');
  }
};

const isAdmin = (req, res, next) => {
  isSignedIn(req, res, () => {
    if (req.user.admin === false) return res.status(401).send('Not a admin');
    else next();
  })
};

module.exports.isAdmin = isAdmin;
module.exports.isSignedIn = isSignedIn;
