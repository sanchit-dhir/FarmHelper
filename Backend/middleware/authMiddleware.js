const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const AuthHeader = req.headers['authorization' || 'Authorization'];
    if (!AuthHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = AuthHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: "Invalid Token!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token!" });
      }
      req.user = decoded;
      next()
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = verifyToken;