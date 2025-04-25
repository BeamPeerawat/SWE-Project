<template>
  <div class="open-course-page">
    <!-- Header -->
    <div class="form-header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>คำร้องขอเปิดรายวิชานอกแผนการเรียน (RE.07)</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          <p v-if="user">ผู้ใช้: {{ user.email }}</p>
        </div>
      </div>
      <button class="back-btn" @click="$router.push('/')">
        <i class="fas fa-arrow-left"></i> ย้อนกลับ
      </button>
    </div>

    <!-- Drafts Button -->
    <div class="drafts-section">
      <button class="drafts-btn" @click="showDrafts">ดูแบบร่าง ({{ draftCount }})</button>
    </div>

    <!-- Drafts Modal -->
    <div v-if="showDraftsModal" class="modal-overlay">
      <div class="modal-content">
        <h2>แบบร่างของคุณ</h2>
        <table class="drafts-table">
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>ภาคการศึกษา</th>
              <th>วันที่บันทึก</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="draft in drafts" :key="draft._id">
              <td>{{ draft.courseCode }}</td>
              <td>{{ draft.courseTitle }}</td>
              <td>{{ draft.semester }}/{{ draft.academicYear }}</td>
              <td>{{ formatDate(draft.createdAt) }}</td>
              <td>
                <button class="action-btn" @click="loadDraft(draft._id)">โหลด</button>
                <button class="action-btn delete-btn" @click="deleteDraft(draft._id)">ลบ</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="close-btn" @click="showDraftsModal = false">ปิด</button>
      </div>
    </div>

    <!-- Form Body -->
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <!-- Section 1: General Info -->
        <div class="form-section">
          <h2>ข้อมูลทั่วไป</h2>
          <div class="form-group">
            <label>ภาคการศึกษา / ปีการศึกษา:</label>
            <div class="inline-inputs">
              <input type="text" v-model="form.semester" placeholder="ภาคการศึกษา" required />
              <input type="text" v-model="form.academicYear" placeholder="ปีการศึกษา" required />
            </div>
          </div>
          <div class="form-group">
            <label>วันที่:</label>
            <div class="inline-inputs">
              <input type="text" v-model="form.date" placeholder="วันที่" required />
              <input type="text" v-model="form.month" placeholder="เดือน" required />
              <input type="text" v-model="form.year" placeholder="ปี" required />
            </div>
          </div>
          <div class="form-group">
            <label>เรียน:</label>
            <input type="text" v-model="form.dean" placeholder="คณบดีคณะ (ชื่อ-นามสกุล)" required />
          </div>
        </div>

        <!-- Section 2: Student Info -->
        <div class="form-section">
          <h2>ข้อมูลนักศึกษา</h2>
          <div class="form-group">
            <label>ชื่อ-นามสกุล (Mr./Mrs./Miss):</label>
            <input type="text" v-model="form.studentName" placeholder="ชื่อ-นามสกุล" required />
          </div>
          <div class="form-group">
            <label>รหัสนักศึกษา:</label>
            <input type="text" v-model="form.studentId" placeholder="รหัสนักศึกษา" required />
          </div>
          <div class="form-group">
            <label>ระดับการศึกษา:</label>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="form.levelOfStudy" value="Certificate" /> ประกาศนียบัตร</label>
              <label><input type="checkbox" v-model="form.levelOfStudy" value="Diploma" /> อนุปริญญา</label>
              <label><input type="checkbox" v-model="form.levelOfStudy" value="Undergraduate" /> ปริญญาตรี</label>
              <label><input type="checkbox" v-model="form.levelOfStudy" value="Master's Degree" /> ปริญญ  ปริญญาโท</label>
              <label><input type="checkbox" v-model="form.levelOfStudy" value="Doctoral Degree" /> ปริญญาเอก</label>
            </div>
          </div>
          <div class="form-group">
            <label>คณะ:</label>
            <input type="text" v-model="form.faculty" placeholder="คณะ" required />
          </div>
          <div class="form-group">
            <label>สาขาวิชา:</label>
            <input type="text" v-model="form.fieldOfStudy" placeholder="สาขาวิชา" required />
          </div>
        </div>

        <!-- Section 3: Course Info -->
        <div class="form-section">
          <h2>ข้อมูลรายวิชา</h2>
          <div class="form-group">
            <label>รายวิชาที่ประสงค์จะขอเปิด:</label>
            <table class="course-table">
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>หน่วยกิต</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select v-model="form.courseCode" @change="updateCourseDetails" required>
                      <option value="" disabled>เลือกรหัสวิชา</option>
                      <option v-for="course in courses" :key="course._id" :value="course.subjectCode">
                        {{ course.subjectCode }}
                      </option>
                    </select>
                  </td>
                  <td><input type="text" v-model="form.courseTitle" placeholder="ชื่อวิชา" readonly /></td>
                  <td><input type="text" v-model="form.credits" placeholder="หน่วยกิต" readonly /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="form-group">
            <label>เหตุผล:</label>
            <textarea v-model="form.reason" placeholder="ระบุเหตุผลที่ต้องการขอเปิดรายวิชานอกแผนการเรียน" required></textarea>
          </div>
        </div>

        <!-- Section 4: Contact Info -->
        <div class="form-section">
          <h2>ข้อมูลติดต่อ</h2>
          <div class="form-group">
            <label>เพื่อพิจารณาคำร้องนี้:</label>
            <p>ติดต่อนักศึกษา:</p>
            <input
              type="tel"
              v-model="form.contactNumber"
              placeholder="เบอร์โทรศัพท์ (10 หลัก)"
              pattern="[0-9]{10}"
              maxlength="10"
              required
              @input="validateContactNumber"
            />
            <span v-if="contactNumberError" class="error-message">{{ contactNumberError }}</span>
            <input
              type="email"
              v-model="form.email"
              placeholder="อีเมล (ต้องเป็น @rmuti.ac.th)"
              pattern="[a-zA-Z0-9._%+-]+@rmuti\.ac\.th"
              required
              @input="validateEmail"
            />
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>
        </div>

        <!-- Section 5: Signature -->
        <div class="form-section">
          <h2>การยืนยัน</h2>
          <div class="form-group">
            <label>ลงชื่อ:</label>
            <input type="text" v-model="form.signature" placeholder="ลงชื่อนักศึกษา" required />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="draft-btn" @click="saveDraft">บันทึกแบบร่าง</button>
          <button type="submit" class="submit-btn">ยื่นคำร้อง</button>
        </div>
      </form>
    </div>

    <!-- Add Popup Notification Component -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">
          <i class="fas fa-check-circle success-icon"></i>
          <h2>แจ้งเตือน</h2>
        </div>
        <div class="popup-body">
          <p>{{ popupMessage }}</p>
        </div>
        <div class="popup-footer">
          <button @click="closePopup" class="popup-btn">ตกลง</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OpenCoursePage',
  data() {
    return {
      user: null,
      form: {
        semester: '',
        academicYear: '',
        date: '',
        month: '',
        year: '',
        dean: '',
        studentName: '',
        studentId: '',
        levelOfStudy: [],
        faculty: '',
        fieldOfStudy: '',
        courseCode: '',
        courseTitle: '',
        credits: '',
        reason: '',
        contactNumber: '',
        email: '',
        signature: ''
      },
      courses: [],
      drafts: [],
      draftCount: 0,
      showDraftsModal: false,
      contactNumberError: '',
      emailError: '',
      showPopup: false,
      popupMessage: ''
    };
  },
  created() {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      // ตรวจสอบว่าเป็นอีเมล @rmuti.ac.th
      if (!this.user.email.endsWith('@rmuti.ac.th')) {
        this.showPopupMessage('กรุณาใช้อีเมลที่ลงท้ายด้วย @rmuti.ac.th');
        this.$router.push('/login');
        return;
      }
      // กรอกข้อมูลฟอร์มอัตโนมัติ
      this.form.studentName = this.user.name || '';
      this.form.email = this.user.email || '';
      this.form.studentId = this.user.studentId || '';
      this.form.signature = this.user.name || '';
    } else {
      // ถ้าไม่ล็อกอิน redirect ไป login
      this.showPopupMessage('กรุณาล็อกอินก่อนยื่นคำร้อง');
      this.$router.push('/login');
    }
  },
  async mounted() {
    await this.fetchCourses();
    await this.fetchDrafts();
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get('/api/subjects');
        this.courses = response.data;
        if (response.data.length === 0) {
          this.showPopupMessage('ไม่พบข้อมูลรายวิชาในระบบ กรุณาติดต่อผู้ดูแล');
        }
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message);
        let errorMessage = 'เกิดข้อผิดพลาดในการโหลดรายวิชา กรุณาตรวจสอบการเชื่อมต่อ backend';
        if (error.response?.status === 404) {
          errorMessage = 'ไม่พบ endpoint รายวิชา กรุณาตรวจสอบ Backend';
        } else if (error.response?.status === 500) {
          errorMessage = 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์ กรุณาติดต่อผู้ดูแล';
        }
        this.showPopupMessage(errorMessage);
      }
    },
    async fetchDrafts() {
      try {
        const response = await axios.get(`/api/opencourserequests/drafts/${this.user._id}`);
        this.drafts = response.data.drafts;
        this.draftCount = response.data.count;
      } catch (error) {
        console.error('Error fetching drafts:', error.response?.data || error.message);
        this.showPopupMessage('เกิดข้อผิดพลาดในการโหลดแบบร่าง');
      }
    },
    async showDrafts() {
      await this.fetchDrafts();
      this.showDraftsModal = true;
    },
    async loadDraft(draftId) {
      try {
        const response = await axios.get(`/api/opencourserequests/${draftId}`);
        this.form = { ...response.data, levelOfStudy: response.data.levelOfStudy || [] };
        this.showDraftsModal = false;
        this.showPopupMessage('โหลดแบบร่างสำเร็จ!');
      } catch (error) {
        console.error('Error loading draft:', error.response?.data || error.message);
        this.showPopupMessage('เกิดข้อผิดพลาดในการโหลดแบบร่าง');
      }
    },
    async deleteDraft(draftId) {
      if (confirm('ยืนยันการลบแบบร่างนี้?')) {
        try {
          await axios.delete(`/api/opencourserequests/${draftId}`);
          this.drafts = this.drafts.filter(draft => draft._id !== draftId);
          this.draftCount -= 1;
          this.showPopupMessage('ลบแบบร่างสำเร็จ!');
        } catch (error) {
          console.error('Error deleting draft:', error.response?.data || error.message);
          this.showPopupMessage('เกิดข้อผิดพลาดในการลบแบบร่าง');
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    updateCourseDetails() {
      const selectedCourse = this.courses.find(course => course.subjectCode === this.form.courseCode);
      if (selectedCourse) {
        this.form.courseTitle = selectedCourse.subjectName;
        this.form.credits = selectedCourse.credits.toString();
      } else {
        this.form.courseTitle = '';
        this.form.credits = '';
      }
    },
    validateContactNumber() {
      const contactNumber = this.form.contactNumber;
      if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
        this.contactNumberError = 'เบอร์โทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น';
      } else {
        this.contactNumberError = '';
      }
    },
    validateEmail() {
      const email = this.form.email;
      if (email && !email.endsWith('@rmuti.ac.th')) {
        this.emailError = 'อีเมลต้องลงท้ายด้วย @rmuti.ac.th';
      } else {
        this.emailError = '';
      }
    },
    async submitForm() {
      // ตรวจสอบก่อนส่ง
      this.validateContactNumber();
      this.validateEmail();

      if (this.contactNumberError || this.emailError) {
        this.showPopupMessage('กรุณาแก้ไขข้อมูลที่ไม่ถูกต้องก่อนยื่นคำร้อง');
        return;
      }

      try {
        const response = await axios.post('/api/opencourserequests/submit', {
          ...this.form,
          userId: this.user?._id
        });
        console.log('Form submitted:', response.data);
        this.showPopupMessage('คำร้องถูกส่งและบันทึกเรียบร้อยแล้ว!');
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Error submitting form:', error.response?.data || error.message);
        this.showPopupMessage('เกิดข้อผิดพลาดในการส่งคำร้อง: ' + (error.response?.data?.message || error.message));
      }
    },
    async saveDraft() {
      try {
        const response = await axios.post('/api/opencourserequests/draft', {
          ...this.form,
          userId: this.user?._id
        });
        console.log('Draft saved:', response.data);
        this.draftCount = response.data.draftCount;
        this.showPopupMessage(`บันทึกแบบร่างสำเร็จ! คุณมีแบบร่างทั้งหมด ${this.draftCount} ฉบับ`);
      } catch (error) {
        console.error('Error saving draft:', error.response?.data || error.message);
        this.showPopupMessage('เกิดข้อผิดพลาดในการบันทึกแบบร่าง: ' + (error.response?.data?.message || error.message));
      }
    },
    showPopupMessage(message) {
      this.popupMessage = message;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.popupMessage = '';
    }
  }
};
</script>

<style scoped>
.open-course-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Kanit', sans-serif;
  padding: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.header-text h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #1a73e8;
}

.header-text p {
  margin: 5px 0 0;
  font-size: 1rem;
  color: #666;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f1f3f5;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #e0e0e0;
}

.drafts-section {
  margin-bottom: 20px;
  text-align: right;
}

.drafts-btn {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.drafts-btn:hover {
  background: #45a049;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-size: 1.5rem;
  color: #1a73e8;
  margin-bottom: 20px;
}

.drafts-table {
  width: 100%;
  border-collapse: collapse;
}

.drafts-table th,
.drafts-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.drafts-table th {
  background: #1a73e8;
  color: white;
}

.drafts-table td {
  background: #f9f9f9;
}

.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  cursor: pointer;
}

.action-btn:not(.delete-btn) {
  background: #1a73e8;
  color: white;
}

.delete-btn {
  background: #d32f2f;
  color: white;
}

.action-btn:hover {
  opacity: 0.9;
}

.close-btn {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background: #f1f3f5;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  cursor: pointer;
}

.close-btn:hover {
  background: #e0e0e0;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 5px solid #1a73e8;
  transition: transform 0.3s;
}

.form-section:hover {
  transform: translateY(-2px);
}

.form-section h2 {
  font-size: 1.5rem;
  color: #1a73e8;
  margin-bottom: 15px;
  border-bottom: 2px solid #1a73e8;
  padding-bottom: 5px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group textarea {
  height: 120px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 5px rgba(26, 115, 232, 0.3);
  outline: none;
}

.inline-inputs {
  display: flex;
  gap: 15px;
}

.inline-inputs input {
  flex: 1;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 400;
  font-size: 1rem;
}

.course-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.course-table th,
.course-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.course-table th {
  background: #1a73e8;
  color: white;
  font-weight: 500;
}

.course-table input,
.course-table select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
}

.course-table select {
  background: #fff;
}

.course-table select:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 5px rgba(26, 115, 232, 0.3);
  outline: none;
}

.course-table input[readonly] {
  background: #f0f0f0;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.submit-btn,
.draft-btn {
  padding: 12px 40px;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.submit-btn {
  background: #1a73e8;
  color: white;
}

.submit-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
}

.draft-btn {
  background: #f39c12;
  color: white;
}

.draft-btn:hover {
  background: #e08e0b;
  transform: translateY(-2px);
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  animation: popup-appear 0.3s ease-out;
}

.popup-header {
  text-align: center;
  margin-bottom: 20px;
}

.success-icon {
  color: #4CAF50;
  font-size: 48px;
  margin-bottom: 10px;
}

.popup-header h2 {
  color: #333;
  margin: 0;
  font-size: 1.5rem;
}

.popup-body {
  text-align: center;
  margin-bottom: 20px;
}

.popup-body p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.5;
}

.popup-footer {
  text-align: center;
}

.popup-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.popup-btn:hover {
  background: #1557b0;
}

@keyframes popup-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>