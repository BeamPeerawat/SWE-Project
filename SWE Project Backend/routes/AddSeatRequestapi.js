const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AddSeatRequest = require('../models/AddSeatRequest');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');
const fontkit = require('@pdf-lib/fontkit');

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

// GET add seat requests by email or userId
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
      return res.status(400).json({ message: "userId is required" });
    }
    const request = new AddSeatRequest({
      ...req.body,
      status: 'draft'
    });
    const savedRequest = await request.save();
    const draftCount = await AddSeatRequest.countDocuments({
      userId: req.body.userId,
      status: 'draft'
    });
    res.status(201).json({ form: savedRequest, draftCount });
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

// POST approve add seat request
router.post('/:id/approve', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const request = await AddSeatRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'submitted') {
      return res.status(400).json({ message: 'Request is not in submitted status' });
    }

    request.status = 'instructor_approved';
    request.instructorComment = req.body.comment || '';
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST reject add seat request
router.post('/:id/reject', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const request = await AddSeatRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'submitted') {
      return res.status(400).json({ message: 'Request is not in submitted status' });
    }

    request.status = 'instructor_rejected';
    request.instructorComment = req.body.comment || '';
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const request = await AddSeatRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'ไม่พบคำร้อง' });
    }

    if (request.status !== 'instructor_approved') {
      return res.status(400).json({ message: 'คำร้องนี้ยังไม่ได้รับการอนุมัติ' });
    }

    // โหลดไฟล์ PDF template
    const templatePath = path.join(__dirname, '../templates/RE.06-คำร้องขอเพิ่มที่นั่ง.pdf'); 
    const pdfBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // โหลดฟอนต์
    pdfDoc.registerFontkit(fontkit);
    const fontPath = path.join(__dirname, '../fonts/THSarabunNew.ttf');
    const fontBytes = await fs.readFile(fontPath);
    const thaiFont = await pdfDoc.embedFont(fontBytes);

    // ดึงหน้าแรก
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize();

    // ฟังก์ชันสำหรับเขียนข้อความ
    const drawText = (text, x, y, size = 16) => {
      page.drawText(text, {
        x,
        y: height - y,
        size,
        font: thaiFont,
        color: require('pdf-lib').rgb(0, 0, 0),
      });
    };

    // กรอกข้อมูลลงใน PDF
    drawText(request.semester, 430, 115); // ภาคการศึกษา
    drawText(request.academicYear, 500, 115); // ปีการศึกษา
    drawText(request.date, 170, 140); // วันที่
    drawText(request.month, 230, 140); // เดือน
    drawText(request.year, 340, 140); // ปี
    drawText(request.lecturer, 170, 165); // เรียน
    drawText(request.studentName, 170, 210); // ชื่อ-นามสกุล
    drawText(request.studentId, 450, 210); // รหัสนักศึกษา
    drawText(request.levelOfStudy, 170, 235); // ระดับการศึกษา
    drawText(request.faculty, 170, 260); // คณะ
    drawText(request.fieldOfStudy, 170, 285); // สาขาวิชา
    drawText(request.classLevel, 450, 285); // ชั้นปี
    drawText(request.courseCode, 110, 340); // รหัสวิชา
    drawText(request.courseTitle, 200, 340); // ชื่อวิชา
    drawText(request.section, 400, 340); // ตอนเรียน
    drawText(request.credits, 450, 340); // หน่วยกิต
    drawText(request.day, 480, 340); // วัน
    drawText(request.time, 510, 340); // เวลา
    drawText(request.room, 550, 340); // ห้อง
    drawText(request.contactNumber, 170, 400); // เบอร์โทร
    drawText(request.email, 350, 400); // อีเมล
    drawText(request.signature, 170, 450); // ลงชื่อ

    // บันทึก PDF
    const pdfBytesModified = await pdfDoc.save();

    // ส่ง PDF กลับไปยัง client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=RE06_${id}.pdf`,
    });
    res.send(Buffer.from(pdfBytesModified));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;