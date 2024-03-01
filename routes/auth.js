const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const {
  login,
  register,
  getUserEmail,
  changeEmail,
  changePassword,
  deleteUser,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router
  .route("/email")
  .get(authenticateUser, getUserEmail)
  .patch(authenticateUser, changeEmail);
router.route("/password").patch(authenticateUser, changePassword);
router.delete("/delete", authenticateUser, deleteUser);
module.exports = router;
