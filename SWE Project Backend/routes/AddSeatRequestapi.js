const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AddSeatRequest = require('../models/AddSeatRequest');

// GET all draft forms for a user
router.get('/drafts/:userId', async (req, res) => {
  try {
    const drafts = await AddSeatRequest.find({
      userId: req.params.userId,
      status: 'draft'
    }).select('courseCode courseTitle semester academicYear createdAt');
    const count = drafts.length;
    res.json({ drafts, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all add seat requests
router.get('/', async (req, res) => {
  try {
    const requests = await AddSeatRequest.find().select('-__v');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET add seat requests by email
router.get('/addseatrequests', async (req, res) => {
  try {
    const { email, userId } = req.query;
    const query = {};
    if (email) query.email = email;
    if (userId) query.userId = userId;

    if (!email && !userId) {
      return res.status(400).json({ message: 'ต้องระบุ email หรือ userId' });
    }

    const requests = await AddSeatRequest.find(query);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET add seat request by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const request = await AddSeatRequest.findById(req.params.id).select('-__v');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST submit add seat request
router.post('/', async (req, res) => {
  try {
    const request = new AddSeatRequest({
      ...req.body,
      status: 'submitted'
    });
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST save draft
router.post('/draft', async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "userId is required"});
    }
    const request = new AddSeatRequest({
      ...req.body,
      status: 'draft'
    });
    const savedRequest = await request.save();
    const draftCount = await AddSeatRequest.countDocuments({
      userId: req.body.userId,
      status: 'draft'
    })
    res.status(201).json({form:savedRequest, draftCount});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update add seat request
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const request = await AddSeatRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    Object.keys(req.body).forEach(key => {
      if (key !== 'status') request[key] = req.body[key];
    });

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE add seat request
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const request = await AddSeatRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;