import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for authenticated user sessions.
 * @param {string} id - Mongoose User ObjectId
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

export default generateToken;