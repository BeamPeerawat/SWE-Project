import axios from 'axios';

// สร้าง instance ของ axios โดยกำหนด baseURL
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // เปลี่ยนเป็น URL ของ backend ถ้า deploy
  withCredentials: true, // สำหรับส่ง cookies ถ้าใช้ session-based auth
});

// API สำหรับจัดการรายวิชา
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);
export const checkSubjectCode = (subjectCode) => api.get(`/subjects/check/${subjectCode}`);

// API สำหรับจัดการผู้ใช้
export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const checkEmail = (email) => api.get(`/users/check/${email}`);

// API สำหรับ dashboard
export const getDashboardSummary = () => api.get('/dashboard');