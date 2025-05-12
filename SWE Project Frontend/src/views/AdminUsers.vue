<template>
    <div class="users-page">
      <div class="header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>จัดการผู้ใช้ - แอดมิน</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            <p v-if="user">ผู้ใช้: {{ user.email }}</p>
          </div>
        </div>
      </div>
  
      <div class="users-container">
        <div class="users-section">
          <h2>ผู้ใช้ทั้งหมด</h2>
          <button class="add-btn" @click="openAddModal">+ เพิ่มผู้ใช้</button>
          <div class="users-table">
            <table>
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>อีเมล</th>
                  <th>บทบาท</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <button class="edit-btn" @click="editUser(user)">แก้ไข</button>
                    <button class="delete-btn" @click="deleteUser(user._id)">ลบ</button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="4">ไม่มีผู้ใช้</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <h2>{{ isEditing ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้' }}</h2>
            <form @submit.prevent="saveUser">
              <div class="form-group">
                <label>ชื่อ:</label>
                <input type="text" v-model="currentUser.name" placeholder="ชื่อ" required />
              </div>
              <div class="form-group">
                <label>อีเมล:</label>
                <input type="email" v-model="currentUser.email" placeholder="อีเมล" required />
              </div>
              <div class="form-group">
                <label>บทบาท:</label>
                <select v-model="currentUser.role" required>
                  <option value="student">นักศึกษา</option>
                  <option value="advisor">อาจารย์ที่ปรึกษา</option>
                  <option value="head">หัวหน้าสาขาวิชา</option>
                  <option value="admin">แอดมิน</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">บันทึก</button>
                <button type="button" class="cancel-btn" @click="closeModal">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <footer class="footer-section">
        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminUsers',
    data() {
      return {
        user: null,
        users: [
          { _id: '1', name: 'สมชาย ใจดี', email: 'somchai@rmuti.ac.th', role: 'student' },
          { _id: '2', name: 'สมหญิง รักดี', email: 'somying@rmuti.ac.th', role: 'advisor' },
        ],
        showModal: false,
        isEditing: false,
        currentUser: { _id: null, name: '', email: '', role: '' },
      };
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) this.user = JSON.parse(userData);
    },
    methods: {
      openAddModal() {
        this.isEditing = false;
        this.currentUser = { _id: null, name: '', email: '', role: '' };
        this.showModal = true;
      },
      editUser(user) {
        this.isEditing = true;
        this.currentUser = { ...user };
        this.showModal = true;
      },
      saveUser() {
        if (this.isEditing) {
          const index = this.users.findIndex(u => u._id === this.currentUser._id);
          if (index !== -1) this.users[index] = { ...this.currentUser };
        } else {
          this.users.push({ _id: String(this.users.length + 1), ...this.currentUser });
        }
        this.closeModal();
        alert('บันทึกผู้ใช้เรียบร้อยแล้ว!');
      },
      deleteUser(id) {
        if (confirm('ยืนยันการลบผู้ใช้นี้?')) {
          this.users = this.users.filter(u => u._id !== id);
          alert('ลบผู้ใช้เรียบร้อยแล้ว!');
        }
      },
      closeModal() {
        this.showModal = false;
        this.currentUser = { _id: null, name: '', email: '', role: '' };
      },
    },
  };
  </script>
  
  <style scoped>
  .users-page { min-height: 100vh; background: #f9fafb; font-family: 'Kanit', sans-serif; padding: 20px; color: #1f2937; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
  .header-content { display: flex; align-items: center; gap: 20px; }
  .logo { width: 70px; height: 70px; border-radius: 50%; background: white; padding: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
  .header-text h1 { margin: 0; font-size: 2rem; font-weight: 600; color: white; }
  .header-text p { margin: 8px 0 0; font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); }
  .users-container { background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
  .users-section { position: relative; }
  .users-section h2 { font-size: 1.5rem; font-weight: 600; color: #2563eb; margin-bottom: 20px; }
  .add-btn { position: absolute; top: 0; right: 0; padding: 10px 20px; background: #10b981; color: #ffffff; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; cursor: pointer; transition: background 0.3s, transform 0.3s; }
  .add-btn:hover { background: #059669; transform: translateY(-2px); }
  .users-table { width: 100%; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d1d5db; padding: 12px; text-align: center; }
  th { background: #2563eb; color: #ffffff; font-weight: 500; }
  td { color: #1f2937; font-size: 1rem; }
  .edit-btn, .delete-btn { padding: 8px 15px; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 0.9rem; cursor: pointer; margin: 0 5px; }
  .edit-btn { background: #f97316; color: #ffffff; }
  .edit-btn:hover { background: #ea580c; }
  .delete-btn { background: #ef4444; color: #ffffff; }
  .delete-btn:hover { background: #dc2626; }
  .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
  .modal-content { background: #ffffff; padding: 20px; border-radius: 12px; width: 90%; max-width: 600px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
  .modal-content h2 { font-size: 1.5rem; font-weight: 600; color: #2563eb; margin-bottom: 20px; }
  .form-group { margin-bottom: 15px; }
  .form-group label { font-weight: 500; font-size: 1rem; color: #1f2937; margin-bottom: 5px; display: block; }
  .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; }
  .form-group input:focus, .form-group select:focus { border-color: #2563eb; box-shadow: 0 0 8px rgba(37, 99, 235, 0.2); outline: none; }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; }
  .save-btn, .cancel-btn { padding: 10px 20px; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; cursor: pointer; }
  .save-btn { background: #10b981; color: #ffffff; }
  .save-btn:hover { background: #059669; }
  .cancel-btn { background: #6b7280; color: #ffffff; }
  .cancel-btn:hover { background: #4b5563; }
  .footer-section { background: #2563eb; color: white; text-align: center; padding: 20px; font-size: 0.9rem; margin-top: 30px; }
  .footer-section p { margin: 0; }
  </style>