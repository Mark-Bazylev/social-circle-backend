const express = require("express");
const router = express.Router();

const {
  getAllAccounts,
  getAccount,
  editAccount,
  deleteAccount,
} = require("../controllers/accounts");

router.route("/").get(getAllAccounts);
router.route("/:id").get(getAccount);
router.route("/edit").patch(editAccount);
module.exports = router;
