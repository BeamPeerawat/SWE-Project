const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/User');

// GET: ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: ดึงข้อมูลผู้ใช้ตาม email
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    res.json({
      student_no: user.student_no,
      faculty: user.faculty,
      branch: user.branch,
      contactNumber: user.contactNumber,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: อัปเดตข้อมูลผู้ใช้ (รวมถึง role)
router.put('/user/:email', async (req, res) => {
  try {
    const updates = {};
    if (req.body.contactNumber) updates.contactNumber = req.body.contactNumber;
    if (req.body.name) updates.name = req.body.name;
    if (req.body.student_no) updates.student_no = req.body.student_no;
    if (req.body.faculty) updates.faculty = req.body.faculty;
    if (req.body.branch) updates.branch = req.body.branch;
    if (req.body.role) updates.role = req.body.role;

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json({
      student_no: user.student_no,
      faculty: user.faculty,
      branch: user.branch,
      contactNumber: user.contactNumber,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: สร้างผู้ใช้ใหม่
router.post('/users', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    student_no: req.body.student_no,
    faculty: req.body.faculty,
    branch: req.body.branch,
    contactNumber: req.body.contactNumber,
    role: req.body.role || 'student', // ค่าเริ่มต้นเป็น student
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Google OAuth routes
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:8080/login' }),
  (req, res) => {
    const user = {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      student_no: req.user.student_no,
      faculty: req.user.faculty,
      branch: req.user.branch,
      contactNumber: req.user.contactNumber,
      role: req.user.role,
    };
    res.redirect(`http://localhost:8080/login?user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

// GET: ดึงข้อมูลผู้ใช้ที่ล็อกอิน
router.get('/auth/user', (req, res) => {
  if (req.user) {
    res.json({
      user: {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        student_no: req.user.student_no,
        faculty: req.user.faculty,
        branch: req.user.branch,
        contactNumber: req.user.contactNumber,
        role: req.user.role,
      },
    });
  } else {
    res.status(401).json({ message: 'ไม่ได้ล็อกอิน' });
  }
});

// PATCH: เปลี่ยน role ของผู้ใช้
router.patch('/user/:email/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'instructor', 'advisor', 'head', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role ไม่ถูกต้อง' });
    }
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: { role } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }
    res.json({
      student_no: user.student_no,
      faculty: user.faculty,
      branch: user.branch,
      contactNumber: user.contactNumber,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;