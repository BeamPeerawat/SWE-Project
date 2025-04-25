const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OpenCourseRequest = require('../models/OpenCourseRequest');

// GET all draft forms for a user
router.get('/drafts/:userId', async (req, res) => {
  try {
    const drafts = await OpenCourseRequest.find({
      userId: req.params.userId,
      status: 'draft'
    }).select('courseCode courseTitle semester academicYear createdAt');
    const count = drafts.length;
    res.json({ drafts, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all request forms
router.get('/', async (req, res) => {
  try {
    const forms = await OpenCourseRequest.find().select('-__v');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET open course requests by email
router.get('/opencourserequests', async (req, res) => {
  try {
    const { email, userId } = req.query;
    const query = {};
    if (email) query.email = email;
    if (userId) query.userId = userId;

    if (!email && !userId) {
      return res.status(400).json({ message: 'ต้องระบุ email หรือ userId' });
    }

    const requests = await OpenCourseRequest.find(query);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET request form by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id).select('-__v');
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST submit form
router.post('/submit', async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const form = new OpenCourseRequest({
      ...req.body,
      status: 'submitted'
    });
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST save draft
router.post('/draft', async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    const form = new OpenCourseRequest({
      ...req.body,
      status: 'draft'
    });
    const savedForm = await form.save();
    const draftCount = await OpenCourseRequest.countDocuments({
      userId: req.body.userId,
      status: 'draft'
    });
    res.status(201).json({ form: savedForm, draftCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update form
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    Object.keys(req.body).forEach(key => {
      if (key !== 'status') form[key] = req.body[key];
    });

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE form
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    await form.deleteOne();
    res.json({ message: 'Form deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;