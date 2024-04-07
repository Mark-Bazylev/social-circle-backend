import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/authentication";
import {
  login,
  register,
  getUserEmail,
  changeEmail,
  changePassword,
  deleteUser,
} from "../controllers/auth";

router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/email")
  .get(authenticateUser, getUserEmail)
  .patch(authenticateUser, changeEmail);
router.route("/password").patch(authenticateUser, changePassword);
router.route("/delete").delete(authenticateUser, deleteUser);
export default router