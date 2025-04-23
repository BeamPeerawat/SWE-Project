const express = require('express');
const router = express.Router();
const AddSeatRequest = require('../models/AddSeatRequest');

// POST create new request
router.post('/', async (req, res) => {
  const newAddSeatRequest = new AddSeatRequest({
    semester: req.body.semester,
    academicYear: req.body.academicYear,
    date: req.body.date,
    month: req.body.month,
    year: req.body.year,
    lecturer: req.body.lecturer,
    studentName: req.body.studentName,
    studentId: req.body.studentId,
    levelOfStudy: req.body.levelOfStudy,
    faculty: req.body.faculty,
    fieldOfStudy: req.body.fieldOfStudy,
    classLevel: req.body.classLevel,
    courseCode: req.body.courseCode,
    courseTitle: req.body.courseTitle,
    section: req.body.section,
    credits: req.body.credits,
    day: req.body.day,
    time: req.body.time,
    room: req.body.room,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    signature: req.body.signature
  });

  try {
    const savedAddSeatRequest = await newAddSeatRequest.save();
    res.status(201).json(savedAddSeatRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;