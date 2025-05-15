import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/tailwind.css';

// ตั้งค่า baseURL สำหรับ Axios เพื่อให้เรียก API ไปที่ Backend
// ตรวจสอบว่ากำลังเรียกจาก Docker หรือไม่โดยดูจาก hostname
const hostname = window.location.hostname;
let baseURL = 'http://localhost:3000';

// กรณีรันบน localhost ให้ใช้ localhost:3000
if (hostname === 'localhost') {
  baseURL = 'http://localhost:3000';
// กรณีรันบนเซิร์ฟเวอร์ 203.158.201.73 ให้ใช้ IP เดียวกันแต่พอร์ต 3001
} else if (hostname === '203.158.201.73') {
  baseURL = 'http://203.158.201.73:3001';
// กรณีรันใน Docker ให้ใช้ชื่อ service
} else {
  baseURL = 'http://backend:3000';
}

console.log('Hostname:', hostname);
console.log('API Base URL:', baseURL);

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true; // เพื่อให้ส่ง cookies ไปด้วย (จำเป็นสำหรับ session)

const app = createApp(App);
app.use(router);
app.config.globalProperties.$axios = axios; // เพิ่ม axios เป็น global property
app.mount('#app');