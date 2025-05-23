import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// ดึงข้อมูลผู้ใช้ที่ล็อกอิน
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// ตรวจสอบว่าเป็น admin หรือไม่
export const isAdmin = (user) => user && user.role === 'admin';

// ออกจากระบบ
export const logout = async () => {
  try {
    await api.get('/auth/logout');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};