const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile
} = require("../controllers/authController");

const {
  protect,
  admin
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

router.get("/admin", protect, admin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin"
  });
});

module.exports = router;