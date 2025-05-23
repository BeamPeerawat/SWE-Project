const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const OpenCourseRequest = require('../models/OpenCourseRequest');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs').promises;
const path = require('path');

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

// GET open course requests by email or userId
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
    console.error('Error fetching open course requests:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET pending requests for advisor
router.get('/advisor/pending', async (req, res) => {
  try {
    const requests = await OpenCourseRequest.find({ status: 'pending_advisor' });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET pending requests for head
router.get('/head/pending', async (req, res) => {
  try {
    const requests = await OpenCourseRequest.find({ status: 'advisor_approved' });
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
      status: 'pending_advisor' // เปลี่ยนจาก submitted เป็น pending_advisor
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

// POST approve request by advisor
router.post('/:id/approve', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (form.status !== 'pending_advisor') {
      return res.status(400).json({ message: 'คำร้องนี้ไม่อยู่ในสถานะรอพิจารณาโดยอาจารย์ที่ปรึกษา' });
    }

    form.status = 'advisor_approved';
    form.advisorComment = req.body.comment || '';
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST reject request by advisor
router.post('/:id/reject', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (form.status !== 'pending_advisor') {
      return res.status(400).json({ message: 'คำร้องนี้ไม่อยู่ในสถานะรอพิจารณาโดยอาจารย์ที่ปรึกษา' });
    }

    form.status = 'advisor_rejected';
    form.advisorComment = req.body.comment || '';
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST approve request by head
router.post('/:id/head/approve', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (form.status !== 'advisor_approved') {
      return res.status(400).json({ message: 'คำร้องนี้ไม่อยู่ในสถานะรอพิจารณาโดยหัวหน้าสาขา' });
    }

    form.status = 'head_approved';
    form.headComment = req.body.comment || '';
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST reject request by head
router.post('/:id/head/reject', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const form = await OpenCourseRequest.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (form.status !== 'advisor_approved') {
      return res.status(400).json({ message: 'คำร้องนี้ไม่อยู่ในสถานะรอพิจารณาโดยหัวหน้าสาขา' });
    }

    form.status = 'head_rejected';
    form.headComment = req.body.comment || '';
    const updatedForm = await form.save();
    res.json(updatedForm);
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

// Add new endpoint for generating PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const request = await OpenCourseRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบคำร้อง' });
    }

    // Load PDF template
    const templatePath = path.join(__dirname, '../templates/RE.07-คำร้องขอเปิดรายวิชานอกแผนการเรียน.pdf');
    const pdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    // Load Thai font
    const fontPath = path.join(__dirname, '../fonts/THSarabunNew.ttf');
    const fontBytes = await fs.readFile(fontPath);
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    // Get the first page
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    // Define text options
    const fontSize = 14;
    const textColor = rgb(0, 0, 0);

    // Helper function to draw text
    const drawText = (text, x, y, size = fontSize) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: thaiFont,
        color: textColor,
      });
    };

    // Helper function to format date to Thai format
    const formatThaiDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear() + 543; // Convert to Thai Buddhist year
      return `${day}/${month}/${year}`;
    };

    // Fill in the form fields
    // Date (top right)
    drawText(formatThaiDate(request.createdAt), 480, height - 50);

    // Dean
    drawText(request.dean || 'คณบดีคณะวิศวกรรมศาสตร์', 120, height - 100);

    // Student Name
    drawText(request.studentName, 150, height - 150);

    // Student ID
    drawText(request.studentId, 400, height - 150);

    // Level of Study (checkbox)
    const level = request.levelOfStudy;
    if (level === 'ปริญญาตรี') {
      page.drawText('☑', { x: 120, y: height - 180, size: 12, font: thaiFont, color: textColor });
    } else if (level === 'ปริญญาโท') {
      page.drawText('☑', { x: 220, y: height - 180, size: 12, font: thaiFont, color: textColor });
    } else if (level === 'ปริญญาเอก') {
      page.drawText('☑', { x: 320, y: height - 180, size: 12, font: thaiFont, color: textColor });
    }

    // Faculty
    drawText(request.faculty, 120, height - 210);

    // Field of Study
    drawText(request.fieldOfStudy, 120, height - 240);

    // Semester
    drawText(request.semester, 120, height - 240);

    // Academic Year
    drawText(request.academicYear, 300, height - 240);

    // Course Code
    drawText(request.courseCode, 120, height - 270);

    // Course Title
    drawText(request.courseTitle, 300, height - 270);

    // Reason
    const reasonLines = request.reason.match(/.{1,50}/g) || [request.reason];
    reasonLines.forEach((line, index) => {
      drawText(line, 120, height - 300 - index * 20);
    });

    // Contact Number
    drawText(request.contactNumber, 120, height - 400);

    // Email
    drawText(request.email, 300, height - 400);

    // Signature (as text, assuming signature is stored as a string)
    drawText(request.signature || request.studentName, 400, height - 450);

    // Save PDF
    const pdfBytesModified = await pdfDoc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=RE07_${id}.pdf`,
    });
    res.send(Buffer.from(pdfBytesModified));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;