<template>
  <div class="add-seat-page">
    <!-- Header -->
    <div class="form-header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>คำร้องขอเพิ่มที่นั่ง (RE.06)</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          <p v-if="user">ผู้ใช้: {{ user.email }}</p>
        </div>
      </div>
      <button class="back-btn" @click="$router.push('/')">
        <i class="fas fa-arrow-left"></i> ย้อนกลับ
      </button>
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
            <input type="text" v-model="form.lecturer" placeholder="อาจารย์ (ชื่อ-นามสกุล)" required />
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
              <label><input type="checkbox" v-model="form.levelOfStudy" value="Master's Degree" /> ปริญญาโท</label>
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
          <div class="form-group">
            <label>ชั้นปี:</label>
            <input type="text" v-model="form.classLevel" placeholder="ชั้นปี" required />
          </div>
        </div>

        <!-- Section 3: Course Info -->
        <div class="form-section">
          <h2>ข้อมูลรายวิชา</h2>
          <div class="form-group">
            <label>รายวิชาที่ต้องการเพิ่มที่นั่ง:</label>
            <table class="course-table">
              <thead>
                <tr>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>ตอนเรียน</th>
                  <th>หน่วยกิต</th>
                  <th>วัน</th>
                  <th>เวลา</th>
                  <th>ห้อง</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select v-model="form.courseCode" @change="updateCourseDetails" required>
                      <option value="" disabled>เลือกวิชา</option>
                      <option v-for="subject in subjects" :key="subject._id" :value="subject.subjectCode">
                        {{ subject.subjectCode }}
                      </option>
                    </select>
                  </td>
                  <td><input type="text" v-model="form.courseTitle" placeholder="ชื่อวิชา" readonly /></td>
                  <td><input type="text" v-model="form.section" placeholder="ตอนเรียน" required /></td>
                  <td><input type="text" v-model="form.credits" placeholder="หน่วยกิต" readonly /></td>
                  <td><input type="text" v-model="form.day" placeholder="วัน" required /></td>
                  <td><input type="text" v-model="form.time" placeholder="เวลา" required /></td>
                  <td><input type="text" v-model="form.room" placeholder="ห้อง" required /></td>
                </tr>
              </tbody>
            </table>
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
  </div>
</template>

<script>
export default {
  name: 'AddSeatPage',
  data() {
    return {
      user: null,
      form: {
        semester: '',
        academicYear: '',
        date: '',
        month: '',
        year: '',
        lecturer: '',
        studentName: '',
        studentId: '',
        levelOfStudy: [],
        faculty: '',
        fieldOfStudy: '',
        classLevel: '',
        courseCode: '',
        courseTitle: '',
        section: '',
        credits: '',
        day: '',
        time: '',
        room: '',
        contactNumber: '',
        email: '',
        signature: '',
      },
      subjects: [],
      contactNumberError: '',
      emailError: '',
    };
  },
  created() {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      // ตรวจสอบว่าเป็นอีเมล @rmuti.ac.th
      if (!this.user.email.endsWith('@rmuti.ac.th')) {
        alert('กรุณาใช้อีเมลที่ลงท้ายด้วย @rmuti.ac.th');
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
      alert('กรุณาล็อกอินก่อนยื่นคำร้อง');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.fetchSubjects();
  },
  methods: {
    async fetchSubjects() {
      try {
        const response = await this.$axios.get('http://localhost:3000/api/subjects');
        this.subjects = response.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
        alert('ไม่สามารถดึงข้อมูลรายวิชาได้');
      }
    },
    updateCourseDetails() {
      const selectedSubject = this.subjects.find(subject => subject.subjectCode === this.form.courseCode);
      if (selectedSubject) {
        this.form.courseTitle = selectedSubject.subjectName;
        this.form.credits = selectedSubject.credits.toString();
      } else {
        this.form.courseTitle = '';
        this.form.credits = '';
      }
    },
    validateContactNumber() {
      const contactNumber = this.form.contactNumber;
      if (!/^\d{10}$/.test(contactNumber)) {
        this.contactNumberError = 'เบอร์โทรศัพท์ต้องมี 10 หลักและเป็นตัวเลขเท่านั้น';
      } else {
        this.contactNumberError = '';
      }
    },
    validateEmail() {
      const email = this.form.email;
      if (!email.endsWith('@rmuti.ac.th')) {
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
        alert('กรุณาแก้ไขข้อมูลที่ไม่ถูกต้องก่อนยื่นคำร้อง');
        return;
      }

      try {
        const response = await this.$axios.post('http://localhost:3000/api/addseatrequests', {
          ...this.form,
          userId: this.user?._id,
        });
        console.log('Form submitted:', response.data);
        alert('คำร้องถูกส่งและบันทึกเรียบร้อยแล้ว!');
        this.$router.push('/');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกคำร้อง: ' + error.response?.data?.message || error.message);
      }
    },
    saveDraft() {
      console.log('Draft saved:', { ...this.form, userId: this.user?._id });
      alert('บันทึกแบบร่างเรียบร้อยแล้ว!');
    },
  },
};
</script>

<style scoped>
.add-seat-page {
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

.form-group input:focus,
.form-group textarea:focus {
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
</style>