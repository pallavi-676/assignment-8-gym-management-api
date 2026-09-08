const User = require("../models/User");

async function checkActiveMember(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ message: "Member not found" });
    }

    if (user.membershipExpiryDate < new Date()) {
      user.membershipStatus = "expired";
      await user.save();

      return res.status(400).json({
        message: "Membership expired"
      });
    }

    if (user.membershipStatus !== "active") {
      return res.status(400).json({
        message: `Membership is ${user.membershipStatus}`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to check membership", error: error.message });
  }
}

module.exports = checkActiveMember;
