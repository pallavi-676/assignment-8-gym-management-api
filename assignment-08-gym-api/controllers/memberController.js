const mongoose = require("mongoose");
const User = require("../models/User");

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

exports.renewMembership = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Member not found" });
    }

    const { additionalMonths, tier } = req.body;
    const months = Number(additionalMonths);

    if (!Number.isInteger(months) || months < 1) {
      return res.status(400).json({
        message: "additionalMonths must be a positive integer"
      });
    }

    if (
      tier !== undefined &&
      !["Bronze", "Silver", "Gold", "Platinum"].includes(tier)
    ) {
      return res.status(400).json({
        message: "Invalid membership tier"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Member not found" });
    }

    const baseDate =
      user.membershipExpiryDate > new Date()
        ? user.membershipExpiryDate
        : new Date();

    user.membershipExpiryDate = addMonths(baseDate, months);
    user.membershipStatus = "active";

    if (tier) {
      user.membershipTier = tier;
    }

    await user.save();

    res.status(200).json({
      message: "Membership renewed successfully",
      member: {
        id: user._id,
        username: user.username,
        email: user.email,
        membershipTier: user.membershipTier,
        membershipStatus: user.membershipStatus,
        membershipExpiryDate: user.membershipExpiryDate
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not renew membership",
      error: error.message
    });
  }
};

exports.getExpiredMembers = async (req, res) => {
  try {
    const expiredMembers = await User.find({
      membershipExpiryDate: { $lt: new Date() }
    }).select("-password");

    res.status(200).json(expiredMembers);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch expired memberships",
      error: error.message
    });
  }
};
