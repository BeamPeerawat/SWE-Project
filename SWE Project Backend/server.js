const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const subjectRoutes = require('./routes/subjectapi');
const addSeatRequestRoutes = require('./routes/AddSeatRequestapi');
const openCourseRequestRoutes = require('./routes/OpenCourseRequest');
const generalRequestRoutes = require('./routes/GeneralRequestapi');

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

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/addseatrequests', addSeatRequestRoutes);
app.use('/api/opencourserequests', openCourseRequestRoutes);
app.use('/api/generalrequests', generalRequestRoutes);

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});