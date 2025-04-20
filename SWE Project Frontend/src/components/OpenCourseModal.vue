<template>
    <div class="modal" v-if="isOpen">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-logo">
            <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
            <div class="header-text">
              <h2>คำร้องขอเปิดรายวิชานอกแผนการเรียน (RE.07)</h2>
              <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            </div>
          </div>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
  
        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <!-- Semester and Academic Year -->
            <div class="form-group">
              <label><i class="fas fa-calendar-alt"></i> ภาคการศึกษา / ปีการศึกษา:</label>
              <div class="inline-inputs">
                <input type="text" v-model="form.semester" placeholder="ภาคการศึกษา" required />
                <input type="text" v-model="form.academicYear" placeholder="ปีการศึกษา" required />
              </div>
            </div>
  
            <!-- Date -->
            <div class="form-group">
              <label><i class="fas fa-calendar-day"></i> วันที่:</label>
              <div class="inline-inputs">
                <input type="text" v-model="form.date" placeholder="วันที่" required />
                <input type="text" v-model="form.month" placeholder="เดือน" required />
                <input type="text" v-model="form.year" placeholder="ปี" required />
              </div>
            </div>
  
            <!-- To Dean -->
            <div class="form-group">
              <label><i class="fas fa-user-tie"></i> เรียน:</label>
              <input type="text" v-model="form.dean" placeholder="คณบดีคณะ (ชื่อ-นามสกุล)" required />
            </div>
  
            <!-- Student Info -->
            <div class="form-group">
              <label><i class="fas fa-user"></i> ชื่อ-นามสกุล (Mr./Mrs./Miss):</label>
              <input type="text" v-model="form.studentName" placeholder="ชื่อ-นามสกุล" required />
            </div>
            <div class="form-group">
              <label><i class="fas fa-id-card"></i> รหัสนักศึกษา:</label>
              <input type="text" v-model="form.studentId" placeholder="รหัสนักศึกษา" required />
            </div>
  
            <!-- Level of Study -->
            <div class="form-group">
              <label><i class="fas fa-graduation-cap"></i> ระดับการศึกษา:</label>
              <div class="checkbox-group">
                <label><input type="checkbox" v-model="form.levelOfStudy" value="Certificate" /> ประกาศนียบัตร</label>
                <label><input type="checkbox" v-model="form.levelOfStudy" value="Diploma" /> อนุปริญญา</label>
                <label><input type="checkbox" v-model="form.levelOfStudy" value="Undergraduate" /> ปริญญาตรี</label>
                <label><input type="checkbox" v-model="form.levelOfStudy" value="Master's Degree" /> ปริญญาโท</label>
                <label><input type="checkbox" v-model="form.levelOfStudy" value="Doctoral Degree" /> ปริญญาเอก</label>
              </div>
            </div>
  
            <!-- Faculty and Field of Study -->
            <div class="form-group">
              <label><i class="fas fa-university"></i> คณะ:</label>
              <input type="text" v-model="form.faculty" placeholder="คณะ" required />
            </div>
            <div class="form-group">
              <label><i class="fas fa-book"></i> สาขาวิชา:</label>
              <input type="text" v-model="form.fieldOfStudy" placeholder="สาขาวิชา" required />
            </div>
  
            <!-- Course Info -->
            <div class="form-group">
              <label><i class="fas fa-chalkboard-teacher"></i> รายวิชาที่ประสงค์จะขอเปิด:</label>
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
                    <td><input type="text" v-model="form.courseCode" placeholder="รหัสวิชา" required /></td>
                    <td><input type="text" v-model="form.courseTitle" placeholder="ชื่อวิชา" required /></td>
                    <td><input type="text" v-model="form.credits" placeholder="หน่วยกิต" required /></td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Reason -->
            <div class="form-group">
              <label><i class="fas fa-comment"></i> เหตุผล:</label>
              <textarea v-model="form.reason" placeholder="ระบุเหตุผลที่ต้องการขอเปิดรายวิชานอกแผนการเรียน" required></textarea>
            </div>
  
            <!-- Contact Info -->
            <div class="form-group">
              <label><i class="fas fa-phone"></i> เพื่อพิจารณาคำร้องนี้:</label>
              <p>ติดต่อนักศึกษา:</p>
              <input type="text" v-model="form.contactNumber" placeholder="เบอร์โทรศัพท์" required />
              <input type="email" v-model="form.email" placeholder="อีเมล" required />
            </div>
  
            <!-- Signature -->
            <div class="form-group signature">
              <label><i class="fas fa-signature"></i> ลงชื่อ:</label>
              <input type.="text" v-model="form.signature" placeholder="ลงชื่อนักศึกษา" required />
            </div>
  
            <!-- Submit Button -->
            <button type="submit" class="submit-btn"><i class="fas fa-paper-plane"></i> ยื่นคำร้อง</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OpenCourseModal',
    props: {
      isOpen: Boolean,
    },
    data() {
      return {
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
          signature: '',
        },
      };
    },
    methods: {
      submitForm() {
        console.log('Form submitted:', this.form);
        alert('คำร้องถูกส่งเรียบร้อยแล้ว!');
        this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: #fff;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 900px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #007bff;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
  
  .header-logo {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  
  .header-text h2 {
    margin: 0;
    font-size: 1.8rem;
    color: #007bff;
  }
  
  .header-text p {
    margin: 5px 0 0;
    font-size: 1rem;
    color: #555;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #ff4d4f;
    cursor: pointer;
    transition: color 0.3s;
  }
  
  .close-btn:hover {
    color: #d9363e;
  }
  
  .modal-body {
    padding: 0;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  .form-group label i {
    color: #007bff;
  }
  
  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .form-group textarea {
    height: 100px;
    resize: vertical;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    border-color: #007bff;
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
    gap: 20px;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
  }
  
  .course-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .course-table th,
  .course-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }
  
  .course-table th {
    background: #007bff;
    color: white;
    font-weight: 600;
  }
  
  .course-table input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
  }
  
  .signature {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .signature input {
    flex: 1;
  }
  
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 30px;
    background: linear-gradient(90deg, #007bff, #00c4cc);
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 500;
    width: 100%;
    transition: background 0.3s;
  }
  
  .submit-btn:hover {
    background: linear-gradient(90deg, #0056b3, #0097a7);
  }
  </style>