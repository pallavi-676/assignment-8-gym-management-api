const mongoose = require("mongoose");
const FitnessClass = require("../models/FitnessClass");

exports.getClasses = async (req, res) => {
  try {
    const filter = {
      scheduleDate: { $gte: new Date() }
    };

    if (req.query.trainer) {
      filter.trainerName = req.query.trainer;
    }

    const classes = await FitnessClass.find(filter)
      .populate("enrolledMembers", "username email membershipTier")
      .sort({ scheduleDate: 1 });

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch classes",
      error: error.message
    });
  }
};

exports.getClassById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Class not found" });
    }

    const fitnessClass = await FitnessClass.findById(req.params.id)
      .populate("enrolledMembers", "username email membershipTier membershipStatus");

    if (!fitnessClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(fitnessClass);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch class",
      error: error.message
    });
  }
};

exports.createClass = async (req, res) => {
  try {
    const {
      title,
      trainerName,
      scheduleDate,
      durationMinutes = 60,
      maxCapacity
    } = req.body;

    if (!title || !trainerName || !scheduleDate || maxCapacity === undefined) {
      return res.status(400).json({
        message: "title, trainerName, scheduleDate and maxCapacity are required"
      });
    }

    const parsedDate = new Date(scheduleDate);
    const capacity = Number(maxCapacity);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid scheduleDate" });
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      return res.status(400).json({
        message: "maxCapacity must be a positive integer"
      });
    }

    const fitnessClass = await FitnessClass.create({
      title,
      trainerName,
      scheduleDate: parsedDate,
      durationMinutes: Number(durationMinutes),
      maxCapacity,
      enrolledMembers: []
    });

    res.status(201).json({
      message: "Fitness class created successfully",
      fitnessClass
    });
  } catch (error) {
    res.status(400).json({
      message: "Could not create class",
      error: error.message
    });
  }
};

exports.bookClass = async (req, res) => {
  try {
    const fitnessClass = await FitnessClass.findById(req.params.id);

    if (!fitnessClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (fitnessClass.scheduleDate < new Date()) {
      return res.status(400).json({
        message: "Cannot book a class that has already started"
      });
    }

    const alreadyBooked = fitnessClass.enrolledMembers.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (alreadyBooked) {
      return res.status(400).json({
        message: "Member is already booked in this class"
      });
    }

    if (fitnessClass.enrolledMembers.length >= fitnessClass.maxCapacity) {
      return res.status(400).json({
        message: "Class capacity reached"
      });
    }

    fitnessClass.enrolledMembers.push(req.user._id);
    await fitnessClass.save();

    await fitnessClass.populate(
      "enrolledMembers",
      "username email membershipTier membershipStatus"
    );

    res.status(200).json({
      message: "Class booking successful",
      fitnessClass
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not book class",
      error: error.message
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const fitnessClass = await FitnessClass.findById(req.params.id);

    if (!fitnessClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const originalLength = fitnessClass.enrolledMembers.length;

    fitnessClass.enrolledMembers = fitnessClass.enrolledMembers.filter(
      (memberId) => memberId.toString() !== req.user._id.toString()
    );

    if (fitnessClass.enrolledMembers.length === originalLength) {
      return res.status(400).json({
        message: "Member is not booked in this class"
      });
    }

    await fitnessClass.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      fitnessClass
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not cancel booking",
      error: error.message
    });
  }
};
