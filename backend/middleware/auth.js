const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and authenticate user
 * Extracts token from Authorization header and validates it
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Please provide a valid token.',
        error: 'NO_TOKEN'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: 'Token has expired. Please login again.',
            error: 'TOKEN_EXPIRED'
          });
        }
        return res.status(403).json({
          success: false,
          message: 'Invalid or malformed token.',
          error: 'INVALID_TOKEN'
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

/**
 * Middleware to verify refresh token
 * Used for refreshing access tokens
 */
const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required.',
        error: 'NO_REFRESH_TOKEN'
      });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key', (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid refresh token.',
          error: 'INVALID_REFRESH_TOKEN'
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Refresh token verification error',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user has admin role
 * Should be used after authenticateToken middleware
 */
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. You do not have permission to perform this action.',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check error',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user owns the resource
 * Should be used after authenticateToken middleware
 */
const isOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
        error: 'NOT_AUTHENTICATED'
      });
    }

    const resourceUserId = req.body.userId || req.params.userId;

    if (req.user.id !== resourceUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
        error: 'NOT_OWNER'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Ownership verification error',
      error: error.message
    });
  }
};

/**
 * Middleware to validate request body for authentication
 */
const validateAuthInput = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        error: 'MISSING_CREDENTIALS'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
        error: 'INVALID_EMAIL'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
        error: 'WEAK_PASSWORD'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Input validation error',
      error: error.message
    });
  }
};

/**
 * Middleware for optional authentication
 * Does not require a token but verifies it if provided
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
        // Continue regardless of token validity for optional auth
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    next(); // Continue on error for optional auth
  }
};

module.exports = {
  authenticateToken,
  verifyRefreshToken,
  isAdmin,
  isOwner,
  validateAuthInput,
  optionalAuth
};
