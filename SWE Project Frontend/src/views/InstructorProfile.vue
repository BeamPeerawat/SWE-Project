<template>
    <div class="profile-page">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>โปรไฟล์ - อาจารย์ประจำวิชา</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          </div>
        </div>
        <button class="back-btn" @click="$router.push('/instructor/home')">
          <i class="fas fa-arrow-left"></i> ย้อนกลับ
        </button>
      </div>
  
      <!-- Profile Content -->
      <div class="profile-container">
        <div class="profile-section user-info">
          <h2>ข้อมูลส่วนตัว</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>ชื่อ-นามสกุล:</label>
              <p v-if="!isEditing">{{ user.name || 'ยังไม่ได้ระบุ' }}</p>
              <input
                v-else
                type="text"
                v-model="editUser.name"
                placeholder="ชื่อ-นามสกุล"
                required
              />
            </div>
            <div class="info-item">
              <label>รหัสอาจารย์:</label>
              <p v-if="!isEditing">{{ user.teacherId || 'ยังไม่ได้ระบุ' }}</p>
              <input
                v-else
                type="text"
                v-model="editUser.teacherId"
                placeholder="รหัสอาจารย์"
                required
              />
            </div>
            <div class="info-item">
              <label>คณะ:</label>
              <p v-if="!isEditing">{{ user.faculty || 'ยังไม่ได้ระบุ' }}</p>
              <input
                v-else
                type="text"
                v-model="editUser.faculty"
                placeholder="คณะ"
                required
              />
            </div>
            <div class="info-item">
              <label>สาขาวิชา:</label>
              <p v-if="!isEditing">{{ user.fieldOfStudy || 'ยังไม่ได้ระบุ' }}</p>
              <input
                v-else
                type="text"
                v-model="editUser.fieldOfStudy"
                placeholder="สาขาวิชา"
                required
              />
            </div>
            <div class="info-item">
              <label>อีเมล:</label>
              <p v-if="!isEditing">{{ user.email || 'ยังไม่ได้ระบุ' }}</p>
              <input
                v-else
                type="email"
                v-model="editUser.email"
                placeholder="อีเมล"
                required
              />
            </div>
            <div class="info-item">
              <label>เบอร์โทรศัพท์:</label>
              <p v-if="!isEditing">{{ user.contactNumber || 'ยังไม่ได้ระบุ' }}</p>
              <div v-else>
                <input
                  type="tel"
                  v-model="editUser.contactNumber"
                  placeholder="เบอร์โทรศัพท์"
                  maxlength="10"
                  inputmode="numeric"
                  pattern="[0-9]{10}"
                  @input="restrictToNumbers"
                  required
                />
                <span
                  v-if="editUser.contactNumber && editUser.contactNumber.length !== 10"
                  class="error-message"
                >
                  กรุณากรอกเบอร์โทรศัพท์ 10 หลัก
                </span>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button v-if="!isEditing" class="edit-btn" @click="editProfile">
              แก้ไขข้อมูล
            </button>
            <div v-else class="edit-actions">
              <button type="button" class="save-btn" @click="saveProfile">
                บันทึก
              </button>
              <button type="button" class="cancel-btn" @click="cancelEdit">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <footer class="footer-section">
        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InstructorProfile',
    data() {
      return {
        isEditing: false,
        user: {
          name: '',
          teacherId: '',
          faculty: '',
          fieldOfStudy: '',
          email: '',
          contactNumber: '',
        },
        editUser: {
          name: '',
          teacherId: '',
          faculty: '',
          fieldOfStudy: '',
          email: '',
          contactNumber: '',
        },
      };
    },
    created() {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    },
    methods: {
      editProfile() {
        this.editUser = { ...this.user };
        this.isEditing = true;
      },
      saveProfile() {
        if (this.editUser.contactNumber.length !== 10) {
          alert('กรุณากรอกเบอร์โทรศัพท์ 10 หลัก');
          return;
        }
        this.user = { ...this.editUser };
        localStorage.setItem('user', JSON.stringify(this.user));
        this.isEditing = false;
        alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
      },
      cancelEdit() {
        this.isEditing = false;
        this.editUser = {
          name: '',
          teacherId: '',
          faculty: '',
          fieldOfStudy: '',
          email: '',
          contactNumber: '',
        };
      },
      restrictToNumbers(event) {
        this.editUser.contactNumber = event.target.value.replace(/[^0-9]/g, '');
      },
    },
  };
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .profile-page {
    min-height: 100vh;
    background: #f9fafb;
    font-family: 'Kanit', sans-serif;
    padding: 20px;
    color: #1f2937;
  }
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 25px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.8s ease-out;
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
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 25px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    font-family: 'Kanit', sans-serif;
    font-size: 1.1rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .profile-container {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: fadeIn 1s ease-out;
  }
  
  .profile-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f9fafb;
    border-radius: 10px;
    border-left: 5px solid #2563eb;
  }
  
  .profile-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 15px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
  }
  
  .info-item label {
    font-weight: 500;
    font-size: 1rem;
    color: #1f2937;
    margin-bottom: 5px;
  }
  
  .info-item p {
    font-size: 1rem;
    color: #6b7280;
  }
  
  .info-item input {
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
  }
  
  .info-item input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 8px rgba(37, 99, 235, 0.2);
    outline: none;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.9rem;
    margin-top: 5px;
  }
  
  .action-buttons {
    margin-top: 20px;
  }
  
  .edit-btn,
  .save-btn,
  .cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  
  .edit-btn {
    background: #f97316;
    color: #ffffff;
  }
  
  .edit-btn:hover {
    background: #ea580c;
    transform: translateY(-2px);
  }
  
  .edit-actions {
    display: flex;
    gap: 10px;
  }
  
  .save-btn {
    background: #10b981;
    color: #ffffff;
  }
  
  .save-btn:hover {
    background: #059669;
    transform: translateY(-2px);
  }
  
  .cancel-btn {
    background: #6b7280;
    color: #ffffff;
  }
  
  .cancel-btn:hover {
    background: #4b5563;
    transform: translateY(-2px);
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
  </style>