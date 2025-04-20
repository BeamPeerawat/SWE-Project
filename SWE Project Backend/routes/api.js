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

   // POST: สร้างผู้ใช้ใหม่
   router.post('/users', async (req, res) => {
     const user = new User({
       name: req.body.name,
       email: req.body.email,
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
       // สร้าง session และ redirect ไปหน้า Home
       const user = {
         _id: req.user._id,
         email: req.user.email,
         name: req.user.name,
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
         },
       });
     } else {
       res.status(401).json({ message: 'ไม่ได้ล็อกอิน' });
     }
   });

   module.exports = router;