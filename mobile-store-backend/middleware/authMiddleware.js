const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. No Token Provided"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token"
    });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin Access Required"
    });
  }

  next();
};

module.exports = {
  protect,
  admin
};