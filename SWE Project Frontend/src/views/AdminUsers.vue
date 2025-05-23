<template>
  <div class="users-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>จัดการผู้ใช้ - แอดมิน</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          <p v-if="user">ผู้ใช้: {{ user.name || user.email }} <button class="logout-btn" @click="logout">ออกจากระบบ</button></p>
        </div>
      </div>
    </div>

    <div class="users-container">
      <div class="users-section">
        <h2>ผู้ใช้ทั้งหมด</h2>
        <div class="controls">
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ค้นหาด้วยชื่อหรืออีเมล..."
              class="search-input"
            />
          </div>
          <div class="filter-container">
            <select v-model="roleFilter" class="filter-select">
              <option value="">ทุกบทบาท</option>
              <option value="admin">แอดมิน</option>
              <option value="student">นักศึกษา</option>
            </select>
            <button class="reset-btn" @click="resetFilters">รีเซ็ต</button>
          </div>
          <button class="add-btn" @click="openAddModal">+ เพิ่มผู้ใช้</button>
        </div>
        <div v-if="loading" class="loading">กำลังโหลด...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="users-table">
          <table>
            <thead>
              <tr>
                <th>อีเมล</th>
                <th>ชื่อ</th>
                <th>บทบาท</th>
                <th>คณะ</th>
                <th>สาขา</th>
                <th>รหัสนักศึกษา</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user._id">
                <td>{{ user.email }}</td>
                <td>{{ user.name || '-' }}</td>
                <td>{{ user.role === 'admin' ? 'แอดมิน' : 'นักศึกษา' }}</td>
                <td>{{ user.faculty || '-' }}</td>
                <td>{{ user.branch || '-' }}</td>
                <td>{{ user.student_no || '-' }}</td>
                <td>
                  <button class="edit-btn" @click="editUser(user)">แก้ไข</button>
                  <button class="delete-btn" @click="deleteUser(user._id, user.email)">ลบ</button>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="7">ไม่พบผู้ใช้ที่ตรงกับการค้นหา</td>
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
              <label>อีเมล:</label>
              <input
                type="email"
                v-model="currentUser.email"
                placeholder="อีเมล"
                required
                @input="validateEmail"
              />
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>
            <div class="form-group">
              <label>ชื่อ:</label>
              <input
                type="text"
                v-model="currentUser.name"
                placeholder="ชื่อ"
                @input="validateName"
              />
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>
            <div class="form-group">
              <label>บทบาท:</label>
              <select v-model="currentUser.role" required @change="validateRole">
                <option value="admin">แอดมิน</option>
                <option value="student">นักศึกษา</option>
              </select>
              <span v-if="errors.role" class="error-text">{{ errors.role }}</span>
            </div>
            <div class="form-group">
              <label>คณะ:</label>
              <input
                type="text"
                v-model="currentUser.faculty"
                placeholder="คณะ"
              />
            </div>
            <div class="form-group">
              <label>สาขา:</label>
              <input
                type="text"
                v-model="currentUser.branch"
                placeholder="สาขา"
              />
            </div>
            <div class="form-group">
              <label>รหัสนักศึกษา:</label>
              <input
                type="text"
                v-model="currentUser.student_no"
                placeholder="รหัสนักศึกษา (เช่น 64332110227-6)"
                @input="validateStudentNo"
              />
              <span v-if="errors.student_no" class="error-text">{{ errors.student_no }}</span>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="saving || hasErrors">บันทึก</button>
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
import { getUsers, createUser, updateUser, deleteUser, checkEmail } from '@/services/api';
import { getCurrentUser, logout } from '@/services/auth';

export default {
  name: 'AdminUsers',
  data() {
    return {
      user: null,
      users: [],
      showModal: false,
      isEditing: false,
      saving: false,
      loading: false,
      error: null,
      searchQuery: '',
      roleFilter: '',
      currentUser: {
        _id: null,
        email: '',
        name: '',
        role: 'student',
        faculty: '',
        branch: '',
        student_no: ''
      },
      errors: {
        email: '',
        name: '',
        role: '',
        student_no: ''
      }
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users;

      // ค้นหาด้วย searchQuery
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.email.toLowerCase().includes(query) ||
            (user.name && user.name.toLowerCase().includes(query))
        );
      }

      // กรองด้วย role
      if (this.roleFilter) {
        filtered = filtered.filter((user) => user.role === this.roleFilter);
      }

      return filtered;
    },
    hasErrors() {
      return Object.values(this.errors).some((error) => error !== '');
    }
  },
  async created() {
    // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
    this.user = await getCurrentUser();
    if (!this.user) {
      this.$router.push('/login');
      return;
    }

    // ดึงรายชื่อผู้ใช้
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getUsers();
        this.users = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดผู้ใช้';
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.currentUser = {
        _id: null,
        email: '',
        name: '',
        role: 'student',
        faculty: '',
        branch: '',
        student_no: ''
      };
      this.errors = {
        email: '',
        name: '',
        role: '',
        student_no: ''
      };
      this.showModal = true;
    },
    editUser(user) {
      this.isEditing = true;
      this.currentUser = { ...user };
      this.errors = {
        email: '',
        name: '',
        role: '',
        student_no: ''
      };
      this.showModal = true;
    },
    async validateEmail() {
      const email = this.currentUser.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this.errors.email = 'กรุณากรอกอีเมล';
      } else if (!emailRegex.test(email)) {
        this.errors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      } else {
        try {
          const response = await checkEmail(email);
          if (response.data.exists && (!this.isEditing || email !== this.currentUser.email)) {
            this.errors.email = 'อีเมลนี้มีอยู่ในระบบแล้ว';
          } else {
            this.errors.email = '';
          }
        } catch (error) {
          this.errors.email = 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล';
        }
      }
    },
    validateName() {
      const name = this.currentUser.name.trim();
      if (name && name.length < 3) {
        this.errors.name = 'ชื่อต้องมีอย่างน้อย 3 ตัวอักษร';
      } else {
        this.errors.name = '';
      }
    },
    validateRole() {
      const role = this.currentUser.role;
      if (!role || !['admin', 'student'].includes(role)) {
        this.errors.role = 'กรุณาเลือกบทบาทที่ถูกต้อง';
      } else {
        this.errors.role = '';
      }
    },
    validateStudentNo() {
      const studentNo = this.currentUser.student_no.trim();
      const studentNoRegex = /^[0-9]{11}-[0-9]$/;
      if (studentNo && !studentNoRegex.test(studentNo)) {
        this.errors.student_no = 'รหัสนักศึกษาต้องเป็นตัวเลข 11 หลัก ตามด้วยขีดและตัวเลข 1 หลัก';
      } else {
        this.errors.student_no = '';
      }
    },
    async saveUser() {
      // ตรวจสอบทุกฟิลด์
      await this.validateEmail();
      this.validateName();
      this.validateRole();
      this.validateStudentNo();

      if (this.hasErrors) {
        alert('กรุณาแก้ไขข้อมูลที่ไม่ถูกต้อง');
        return;
      }

      this.saving = true;
      try {
        if (this.isEditing) {
          await updateUser(this.currentUser._id, this.currentUser);
          alert('อัปเดตผู้ใช้เรียบร้อยแล้ว!');
        } else {
          await createUser(this.currentUser);
          alert('เพิ่มผู้ใช้เรียบร้อยแล้ว!');
        }
        await this.fetchUsers();
        this.closeModal();
      } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถบันทึกได้'));
      } finally {
        this.saving = false;
      }
    },
    async deleteUser(id, email) {
      if (email === this.user.email) {
        alert('ไม่สามารถลบตัวเองได้');
        return;
      }
      if (confirm('ยืนยันการลบผู้ใช้นี้?')) {
        try {
          await deleteUser(id);
          alert('ลบผู้ใช้เรียบร้อยแล้ว!');
          await this.fetchUsers();
        } catch (error) {
          alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถลบได้'));
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.currentUser = {
        _id: null,
        email: '',
        name: '',
        role: 'student',
        faculty: '',
        branch: '',
        student_no: ''
      };
      this.errors = {
        email: '',
        name: '',
        role: '',
        student_no: ''
      };
    },
    async logout() {
      if (await logout()) {
        alert('ออกจากระบบสำเร็จ');
        this.$router.push('/login');
      } else {
        alert('เกิดข้อผิดพลาดในการออกจากระบบ');
      }
    },
    resetFilters() {
      this.searchQuery = '';
      this.roleFilter = '';
    }
  }
};
</script>

<style scoped>
.users-page {
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'Kanit', sans-serif;
  padding: 20px;
  color: #1f2937;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}
.logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  padding: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.header-text h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  color: white;
}
.header-text p {
  margin: 8px 0 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
}
.logout-btn {
  margin-left: 10px;
  padding: 5px 10px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #dc2626;
}
.users-container {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.users-section {
  position: relative;
}
.users-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 20px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
}
.search-container {
  flex: 1;
  min-width: 200px;
}
.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
}
.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.2);
  outline: none;
}
.filter-container {
  display: flex;
  gap: 10px;
  align-items: center;
}
.filter-select {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  background: #ffffff;
}
.reset-btn {
  padding: 10px 15px;
  background: #6b7280;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  cursor: pointer;
}
.reset-btn:hover {
  background: #4b5563;
}
.add-btn {
  padding: 10px 20px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.add-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}
.users-table {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #d1d5db;
  padding: 12px;
  text-align: center;
}
th {
  background: #2563eb;
  color: #ffffff;
  font-weight: 500;
}
td {
  color: #1f2937;
  font-size: 1rem;
}
.edit-btn,
.delete-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 0 5px;
}
.edit-btn {
  background: #f97316;
  color: #ffffff;
}
.edit-btn:hover {
  background: #ea580c;
}
.delete-btn {
  background: #ef4444;
  color: #ffffff;
}
.delete-btn:hover {
  background: #dc2626;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  font-weight: 500;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 5px;
  display: block;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
}
.form-group select {
  background: #ffffff;
}
.form-group textarea {
  height: 100px;
  resize: vertical;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.2);
  outline: none;
}
.error-text {
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.save-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  cursor: pointer;
}
.save-btn {
  background: #10b981;
  color: #ffffff;
}
.save-btn:hover {
  background: #059669;
}
.save-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}
.cancel-btn {
  background: #6b7280;
  color: #ffffff;
}
.cancel-btn:hover {
  background: #4b5563;
}
.footer-section {
  background: #2563eb;
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
  margin-top: 30px;
}
.footer-section p {
  margin: 0;
}
.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #2563eb;
  margin: 20px 0;
}
.error {
  text-align: center;
  font-size: 1.2rem;
  color: #ef4444;
  margin: 20px 0;
}
</style>