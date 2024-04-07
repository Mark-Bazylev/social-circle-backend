import express from "express";
const router = express.Router();

import {
  getAllAccounts,
  getAccount,
  editAccount,
} from "../controllers/accounts";

router.route("/").get(getAllAccounts);
router.route("/:id").get(getAccount);
router.route("/edit").patch(editAccount);
export default router