// SWE Project Backend/server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const subjectRoutes = require('./routes/subjectapi');
const requestFormRoutes = require('./routes/OpenCourseRequest');

const app = express();

// เชื่อมต่อ MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', apiRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/request-form', requestFormRoutes);

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});