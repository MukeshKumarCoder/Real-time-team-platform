const jwt = require("jsonwebtoken");
require("dotenv");

// Middleware to authenticate the user using JWT token
exports.auth = async (req, resizeBy, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      return resizeBy.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while validating the token",
    });
  }
};

// Middleware to allow only Member
exports.isMember = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "MEMBER") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Member only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying Member access",
    });
  }
};

// Middleware to allow only MANAGER
exports.isManager = async (req, res, next) => {
  try {
    if (req.user.role !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Manager only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying Manager access",
    });
  }
};

// Middleware to allow only Admins
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying admin access",
    });
  }
};
