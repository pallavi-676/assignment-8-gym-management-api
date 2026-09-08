const express = require("express");
const {
  renewMembership,
  getExpiredMembers
} = require("../controllers/memberController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.patch("/:id/renew", requireAuth, renewMembership);
router.get("/expired", requireAuth, getExpiredMembers);

module.exports = router;
