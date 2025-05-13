const express = require('express');
const router = express.Router();
const GeneralRequest = require('../models/GeneralRequest');
const User = require('../models/User');

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'กรุณาล็อกอินก่อนดำเนินการ' });
};

// POST: Create a new general request (draft or submitted)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const {
      date,
      month,
      year,
      studentId,
      fullName,
      faculty,
      fieldOfStudy,
      petitionType,
      details,
      contactNumber,
      email,
      signature,
      status = 'submitted', // Default to submitted
    } = req.body;

    // Validate email matches authenticated user
    if (req.user.email !== email) {
      return res.status(403).json({ message: 'ไม่สามารถยื่นคำร้องสำหรับอีเมลอื่นได้' });
    }

    // Verify user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    const generalRequest = new GeneralRequest({
      user: req.user._id,
      email,
      date,
      month,
      year,
      studentId,
      fullName,
      faculty,
      fieldOfStudy,
      petitionType,
      details,
      contactNumber,
      signature,
      status,
    });

    const savedRequest = await generalRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Fetch all drafts for the authenticated user
router.get('/drafts', ensureAuthenticated, async (req, res) => {
  try {
    const drafts = await GeneralRequest.find({
      user: req.user._id,
      status: 'draft',
    }).sort({ createdAt: -1 });
    res.json(drafts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch all submitted requests for the authenticated user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const requests = await GeneralRequest.find({
      user: req.user._id,
      status: 'submitted',
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Fetch a specific request by ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const request = await GeneralRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบคำร้อง' });
    }
    // Ensure the request belongs to the authenticated user
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงคำร้องนี้' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update a general request
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updates = req.body;

    // Prevent updating user or email fields
    delete updates.user;
    delete updates.email;

    const request = await GeneralRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบคำร้อง' });
    }

    // Ensure the request belongs to the authenticated user
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์อัปเดตคำร้องนี้' });
    }

    const updatedRequest = await GeneralRequest.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a draft
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const request = await GeneralRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบแบบร่าง' });
    }

    // Ensure the request is a draft and belongs to the authenticated user
    if (request.status !== 'draft') {
      return res.status(400).json({ message: 'สามารถลบได้เฉพาะแบบร่างเท่านั้น' });
    }
    if (request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบแบบร่างนี้' });
    }

    await GeneralRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบแบบร่างสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;