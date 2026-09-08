const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      membershipTier = "Bronze",
      durationMonths = 1,
      emergencyContact
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required"
      });
    }

    if (!["Bronze", "Silver", "Gold", "Platinum"].includes(membershipTier)) {
      return res.status(400).json({
        message: "Invalid membershipTier"
      });
    }

    const months = Number(durationMonths);

    if (!Number.isInteger(months) || months < 1) {
      return res.status(400).json({
        message: "durationMonths must be a positive integer"
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = addMonths(new Date(), months);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      membershipTier,
      membershipStatus: "active",
      membershipExpiryDate: expiryDate,
      emergencyContact
    });

    res.status(201).json({
      message: "Member registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        membershipTier: user.membershipTier,
        membershipStatus: user.membershipStatus,
        membershipExpiryDate: user.membershipExpiryDate,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid username or password"
      });
    }

    req.logIn(user, (loginError) => {
      if (loginError) return next(loginError);

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          membershipTier: user.membershipTier,
          membershipStatus: user.membershipStatus,
          membershipExpiryDate: user.membershipExpiryDate
        }
      });
    });
  })(req, res, next);
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const now = new Date();
    const remainingMilliseconds = user.membershipExpiryDate - now;
    const remainingDays = Math.max(
      0,
      Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24))
    );

    if (remainingMilliseconds <= 0 && user.membershipStatus === "active") {
      user.membershipStatus = "expired";
      await user.save();
    }

    res.status(200).json({
      user,
      remainingDays
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch profile",
      error: error.message
    });
  }
};

exports.logout = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError);

      res.status(200).json({
        message: "Logout successful"
      });
    });
  });
};
