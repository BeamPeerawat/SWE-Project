<template>
    <div class="courses-page">
      <div class="header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>จัดการรายวิชา - แอดมิน</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            <p v-if="user">ผู้ใช้: {{ user.email }}</p>
          </div>
        </div>
      </div>
  
      <div class="courses-container">
        <div class="courses-section">
          <h2>รายวิชาทั้งหมด</h2>
          <button class="add-btn" @click="openAddModal">+ เพิ่มรายวิชา</button>
          <div class="courses-table">
            <table>
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>หน่วยกิต</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="course in courses" :key="course._id">
                  <td>{{ course.courseCode }}</td>
                  <td>{{ course.courseName }}</td>
                  <td>{{ course.credits }}</td>
                  <td>
                    <button class="edit-btn" @click="editCourse(course)">แก้ไข</button>
                    <button class="delete-btn" @click="deleteCourse(course._id)">ลบ</button>
                  </td>
                </tr>
                <tr v-if="courses.length === 0">
                  <td colspan="4">ไม่มีรายวิชา</td>
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
                  v-model="currentCourse.courseCode"
                  placeholder="รหัสวิชา"
                  required
                />
              </div>
              <div class="form-group">
                <label>ชื่อวิชา:</label>
                <input
                  type="text"
                  v-model="currentCourse.courseName"
                  placeholder="ชื่อวิชา"
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
    name: 'AdminCourses',
    data() {
      return {
        user: null,
        courses: [
          { _id: '1', courseCode: 'CS101', courseName: 'Introduction to Programming', credits: 3 },
          { _id: '2', courseCode: 'CS102', courseName: 'Data Structures', credits: 3 },
        ],
        showModal: false,
        isEditing: false,
        currentCourse: { _id: null, courseCode: '', courseName: '', credits: '' },
      };
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) this.user = JSON.parse(userData);
    },
    methods: {
      openAddModal() {
        this.isEditing = false;
        this.currentCourse = { _id: null, courseCode: '', courseName: '', credits: '' };
        this.showModal = true;
      },
      editCourse(course) {
        this.isEditing = true;
        this.currentCourse = { ...course };
        this.showModal = true;
      },
      saveCourse() {
        if (this.isEditing) {
          const index = this.courses.findIndex(c => c._id === this.currentCourse._id);
          if (index !== -1) this.courses[index] = { ...this.currentCourse };
        } else {
          this.courses.push({ _id: String(this.courses.length + 1), ...this.currentCourse });
        }
        this.closeModal();
        alert('บันทึกรายวิชาเรียบร้อยแล้ว!');
      },
      deleteCourse(id) {
        if (confirm('ยืนยันการลบรายวิชานี้?')) {
          this.courses = this.courses.filter(c => c._id !== id);
          alert('ลบรายวิชาเรียบร้อยแล้ว!');
        }
      },
      closeModal() {
        this.showModal = false;
        this.currentCourse = { _id: null, courseCode: '', courseName: '', credits: '' };
      },
    },
  };
  </script>
  
  <style scoped>
  .courses-page { min-height: 100vh; background: #f9fafb; font-family: 'Kanit', sans-serif; padding: 20px; color: #1f2937; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
  .header-content { display: flex; align-items: center; gap: 20px; }
  .logo { width: 70px; height: 70px; border-radius: 50%; background: white; padding: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
  .header-text h1 { margin: 0; font-size: 2rem; font-weight: 600; color: white; }
  .header-text p { margin: 8px 0 0; font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); }
  .courses-container { background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
  .courses-section { position: relative; }
  .courses-section h2 { font-size: 1.5rem; font-weight: 600; color: #2563eb; margin-bottom: 20px; }
  .add-btn { position: absolute; top: 0; right: 0; padding: 10px 20px; background: #10b981; color: #ffffff; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; cursor: pointer; transition: background 0.3s, transform 0.3s; }
  .add-btn:hover { background: #059669; transform: translateY(-2px); }
  .courses-table { width: 100%; overflow-x: auto; }
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
  .form-group input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; }
  .form-group input:focus { border-color: #2563eb; box-shadow: 0 0 8px rgba(37, 99, 235, 0.2); outline: none; }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; }
  .save-btn, .cancel-btn { padding: 10px 20px; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; cursor: pointer; }
  .save-btn { background: #10b981; color: #ffffff; }
  .save-btn:hover { background: #059669; }
  .cancel-btn { background: #6b7280; color: #ffffff; }
  .cancel-btn:hover { background: #4b5563; }
  .footer-section { background: #2563eb; color: white; text-align: center; padding: 20px; font-size: 0.9rem; margin-top: 30px; }
  .footer-section p { margin: 0; }
  </style>