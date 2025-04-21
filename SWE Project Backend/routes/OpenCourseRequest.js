// SWE Project Backend/routes/OpenCourseRequest.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OpenCourseRequest = require('../models/OpenCourseRequest');

// GET all request forms
router.get('/', async (req, res) => {
  try {
    const forms = await OpenCourseRequest.find().select('-__v');
    res.json(forms);
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
    const form = new OpenCourseRequest({
      ...req.body,
      status: 'draft'
    });
    const savedForm = await form.save();
    res.status(201).json(savedForm);
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

    // อัปเดตเฉพาะฟิลด์ที่ส่งมา
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

    await form.remove();
    res.json({ message: 'Form deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;