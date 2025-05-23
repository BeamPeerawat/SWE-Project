<template>
  <div class="courses-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>จัดการรายวิชา - แอดมิน</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          <p v-if="user">ผู้ใช้: {{ user.name || user.email }} </p>
        </div>
      </div>
    </div>

    <div class="courses-container">
      <div class="courses-section">
        <h2>รายวิชาทั้งหมด</h2>
        <div class="controls">
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ค้นหาด้วยรหัสวิชาหรือชื่อวิชา..."
              class="search-input"
            />
          </div>
          <div class="filter-container">
            <select v-model="creditsFilter" class="filter-select">
              <option value="">ทุกหน่วยกิต</option>
              <option value="1">1 หน่วยกิต</option>
              <option value="2">2 หน่วยกิต</option>
              <option value="3">3 หน่วยกิต</option>
              <option value="4">4 หน่วยกิต</option>
            </select>
            <button class="reset-btn" @click="resetFilters">รีเซ็ต</button>
          </div>
          <button class="add-btn" @click="openAddModal">+ เพิ่มรายวิชา</button>
        </div>
        <div v-if="loading" class="loading">กำลังโหลด...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="courses-table">
          <table>
            <thead>
              <tr>
                <th>รหัสวิชา</th>
                <th>ชื่อวิชา (TH)</th>
                <th>ชื่อวิชา (EN)</th>
                <th>หน่วยกิต</th>
                <th>คำอธิบาย</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in filteredCourses" :key="course._id">
                <td>{{ course.subjectCode }}</td>
                <td>{{ course.subjectNameTH }}</td>
                <td>{{ course.subjectNameEN }}</td>
                <td>{{ course.credits }}</td>
                <td>{{ course.description || '-' }}</td>
                <td>
                  <button class="edit-btn" @click="editCourse(course)">แก้ไข</button>
                  <button class="delete-btn" @click="deleteCourse(course._id)">ลบ</button>
                </td>
              </tr>
              <tr v-if="filteredCourses.length === 0">
                <td colspan="6">ไม่พบรายวิชาที่ตรงกับการค้นหา</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>{{ isEditing ? 'แก้ไขรายวิชา' : 'เพิ่มรายวิชา' }}</h2>
          <form @submit.prevent="saveCourse">
            <div class="form-group">
              <label>รหัสวิชา:</label>
              <input
                type="text"
                v-model="currentCourse.subjectCode"
                placeholder="รหัสวิชา"
                required
              />
            </div>
            <div class="form-group">
              <label>ชื่อวิชา (TH):</label>
              <input
                type="text"
                v-model="currentCourse.subjectNameTH"
                placeholder="ชื่อวิชาภาษาไทย"
                required
              />
            </div>
            <div class="form-group">
              <label>ชื่อวิชา (EN):</label>
              <input
                type="text"
                v-model="currentCourse.subjectNameEN"
                placeholder="ชื่อวิชาภาษาอังกฤษ"
                required
              />
            </div>
            <div class="form-group">
              <label>หน่วยกิต:</label>
              <input
                type="number"
                v-model="currentCourse.credits"
                placeholder="หน่วยกิต"
                required
                min="1"
              />
            </div>
            <div class="form-group">
              <label>คำอธิบาย:</label>
              <textarea
                v-model="currentCourse.description"
                placeholder="คำอธิบายวิชา (ถ้ามี)"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="save-btn" :disabled="saving">บันทึก</button>
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
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/services/api';
import { getCurrentUser, logout } from '@/services/auth';

export default {
  name: 'AdminCourses',
  data() {
    return {
      user: null,
      courses: [],
      showModal: false,
      isEditing: false,
      saving: false,
      loading: false,
      error: null,
      searchQuery: '',
      creditsFilter: '',
      currentCourse: {
        _id: null,
        subjectCode: '',
        subjectNameTH: '',
        subjectNameEN: '',
        credits: '',
        description: ''
      }
    };
  },
  computed: {
    filteredCourses() {
      let filtered = this.courses;

      // ค้นหาด้วย searchQuery
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (course) =>
            course.subjectCode.toLowerCase().includes(query) ||
            course.subjectNameTH.toLowerCase().includes(query) ||
            course.subjectNameEN.toLowerCase().includes(query)
        );
      }

      // กรองด้วย credits
      if (this.creditsFilter) {
        filtered = filtered.filter(
          (course) => course.credits.toString() === this.creditsFilter
        );
      }

      return filtered;
    }
  },
  async created() {
    // ดึงข้อมูลผู้ใช้จาก backend
    this.user = await getCurrentUser();
    if (!this.user) {
      this.$router.push('/login');
      return;
    }

    // ดึงรายวิชาจาก backend
    await this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getSubjects();
        this.courses = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดรายวิชา';
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.currentCourse = {
        _id: null,
        subjectCode: '',
        subjectNameTH: '',
        subjectNameEN: '',
        credits: '',
        description: ''
      };
      this.showModal = true;
    },
    editCourse(course) {
      this.isEditing = true;
      this.currentCourse = { ...course };
      this.showModal = true;
    },
    async saveCourse() {
      this.saving = true;
      try {
        if (this.isEditing) {
          await updateSubject(this.currentCourse._id, this.currentCourse);
          alert('อัปเดตรายวิชาเรียบร้อยแล้ว!');
        } else {
          await createSubject(this.currentCourse);
          alert('เพิ่มรายวิชาเรียบร้อยแล้ว!');
        }
        await this.fetchCourses();
        this.closeModal();
      } catch (error) {
        alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถบันทึกได้'));
      } finally {
        this.saving = false;
      }
    },
    async deleteCourse(id) {
      if (confirm('ยืนยันการลบรายวิชานี้?')) {
        try {
          await deleteSubject(id);
          alert('ลบรายวิชาเรียบร้อยแล้ว!');
          await this.fetchCourses();
        } catch (error) {
          alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || 'ไม่สามารถลบได้'));
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.currentCourse = {
        _id: null,
        subjectCode: '',
        subjectNameTH: '',
        subjectNameEN: '',
        credits: '',
        description: ''
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
      this.creditsFilter = '';
    }
  }
};
</script>

<style scoped>
.courses-page {
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
.courses-container {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.courses-section {
  position: relative;
}
.courses-section h2 {
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
.courses-table {
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
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
}
.form-group textarea {
  height: 100px;
  resize: vertical;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.2);
  outline: none;
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