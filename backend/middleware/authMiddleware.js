// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
// We need the same secret key from our auth.js to verify the token
const JWT_SECRET = 'your-super-secret-key-12345';

module.exports = function(req, res, next) {
  // 1. Get token from the request header
  const token = req.header('authorization');

  // 2. Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // 3. The token is usually in the format "Bearer <token>". We need to extract just the token part.
  const tokenPart = token.split(' ')[1];
  if (!tokenPart) {
    return res.status(401).json({ message: 'Token format is invalid.' });
  }

  // 4. Verify the token
  try {
    const decoded = jwt.verify(tokenPart, JWT_SECRET);

    // 5. Add the user payload from the token to the request object
    req.user = decoded.user;
    next(); // Move on to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};