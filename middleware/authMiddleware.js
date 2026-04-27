const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // 1. Check token exists
    if (!token || !token.startsWith('Bearer')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 2. Remove "Bearer"
    token = token.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = { protect };