const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  try {
    // Check for token in Authorization header or query params
    const authHeader = req.headers['authorization'];
    const queryToken = req.query.token;
    
    let token;
    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else if (queryToken) {
      token = queryToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
}; 