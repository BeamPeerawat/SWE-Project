const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/User');

// Middleware to ensure user is authenticated and authorized
const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    // Allow admins to update any user, or users to update their own profile
    if (req.user.role === 'admin' || req.user.email === req.params.email) {
      return next();
    }
    return res.status(403).json({ message: 'คุณไม่มีสิทธิ์อัปเดตข้อมูลผู้ใช้นี้' });
  }
  res.status(401).json({ message: 'ไม่ได้ล็อกอิน' });
};

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
      group: user.group,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: อัปเดตข้อมูลผู้ใช้ (ไม่รวม group)
router.put('/user/:email', ensureAuthenticated, async (req, res) => {
  try {
    const updates = {};
    if (req.body.contactNumber) {
      // Validate contactNumber: must be 10 digits
      if (!/^\d{10}$/.test(req.body.contactNumber)) {
        return res.status(400).json({ message: 'เบอร์โทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น' });
      }
      updates.contactNumber = req.body.contactNumber;
    }
    if (req.body.name) updates.name = req.body.name;
    if (req.body.student_no) updates.student_no = req.body.student_no;
    if (req.body.faculty) updates.faculty = req.body.faculty;
    if (req.body.branch) updates.branch = req.body.branch;
    if (req.body.role && req.user.role === 'admin') updates.role = req.body.role; // Only admins can update role

    // Explicitly exclude group from updates
    if (req.body.group) {
      return res.status(400).json({ message: 'ไม่สามารถอัปเดตชั้นปีได้' });
    }

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updates },
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
      group: user.group,
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
    group: req.body.group,
    role: req.body.role || 'student',
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
      group: req.user.group,
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
        group: req.user.group,
        role: req.user.role,
      },
    });
  } else {
    res.status(401).json({ message: 'ไม่ได้ล็อกอิน' });
  }
});

// PATCH: เปลี่ยน role ของผู้ใช้
router.patch('/user/:email/role', ensureAuthenticated, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'instructor', 'advisor', 'head', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role ไม่ถูกต้อง' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'เฉพาะผู้ดูแลระบบเท่านั้นที่เปลี่ยน role ได้' });
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
      group: user.group,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;