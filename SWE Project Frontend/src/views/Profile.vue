<template>
    <div class="profile-page">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>โปรไฟล์ผู้ใช้</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          </div>
        </div>
        <button class="back-btn" @click="$router.push('/')">
          <i class="fas fa-arrow-left"></i> ย้อนกลับ
        </button>
      </div>
  
      <!-- Profile Content -->
      <div class="profile-container">
        <!-- User Info Section -->
        <div class="profile-section user-info">
          <h2>ข้อมูลส่วนตัว</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>ชื่อ-นามสกุล:</label>
              <p>{{ user.name || 'ยังไม่ได้ระบุ' }}</p>
            </div>
            <div class="info-item">
              <label>รหัสนักศึกษา:</label>
              <p>{{ user.studentId || 'ยังไม่ได้ระบุ' }}</p>
            </div>
            <div class="info-item">
              <label>คณะ:</label>
              <p>{{ user.faculty || 'ยังไม่ได้ระบุ' }}</p>
            </div>
            <div class="info-item">
              <label>สาขาวิชา:</label>
              <p>{{ user.fieldOfStudy || 'ยังไม่ได้ระบุ' }}</p>
            </div>
            <div class="info-item">
              <label>อีเมล:</label>
              <p>{{ user.email || 'ยังไม่ได้ระบุ' }}</p>
            </div>
            <div class="info-item">
              <label>เบอร์โทรศัพท์:</label>
              <p>{{ user.contactNumber || 'ยังไม่ได้ระบุ' }}</p>
            </div>
          </div>
          <button class="edit-btn" @click="editProfile">แก้ไขข้อมูล</button>
        </div>
  
        <!-- Request History Section -->
        <div class="profile-section request-history">
          <h2>ประวัติการยื่นคำร้อง</h2>
          <div class="history-table">
            <table>
              <thead>
                <tr>
                  <th>วันที่ยื่น</th>
                  <th>ประเภทคำร้อง</th>
                  <th>รายวิชา</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(request, index) in requestHistory" :key="index">
                  <td>{{ request.date }}</td>
                  <td>{{ request.type }}</td>
                  <td>{{ request.course }}</td>
                  <td>
                    <span :class="getStatusClass(request.status)">{{ request.status }}</span>
                  </td>
                  <td>
                    <button class="view-btn" @click="viewRequest(request)">ดูรายละเอียด</button>
                  </td>
                </tr>
                <tr v-if="requestHistory.length === 0">
                  <td colspan="5">ยังไม่มีประวัติการยื่นคำร้อง</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfilePage',
    data() {
      return {
        user: {
          name: '',
          studentId: '',
          faculty: '',
          fieldOfStudy: '',
          email: '',
          contactNumber: '',
        },
        requestHistory: [
          // ข้อมูลตัวอย่าง (ในอนาคตควรดึงจาก Backend หรือ Local Storage)
          {
            date: '2025-04-01',
            type: 'คำร้องขอเพิ่มที่นั่ง',
            course: 'CS101 - การเขียนโปรแกรมเบื้องต้น',
            status: 'อนุมัติ',
          },
          {
            date: '2025-03-15',
            type: 'คำร้องขอเปิดรายวิชานอกแผน',
            course: 'ENG201 - ภาษาอังกฤษเพื่อการสื่อสาร',
            status: 'รอพิจารณา',
          },
        ],
      };
    },
    mounted() {
      // ดึงข้อมูลผู้ใช้จาก Local Storage (สมมติว่ามีการเก็บข้อมูลหลังล็อกอิน)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    },
    methods: {
      editProfile() {
        // ฟังก์ชันแก้ไขข้อมูล (ในอนาคตสามารถเพิ่ม Modal หรือหน้าแก้ไข)
        alert('ฟังก์ชันแก้ไขข้อมูลยังไม่พร้อมใช้งาน');
      },
      viewRequest(request) {
        // ฟังก์ชันดูรายละเอียดคำร้อง
        alert(`ดูรายละเอียดคำร้อง\nวันที่: ${request.date}\nประเภท: ${request.type}\nรายวิชา: ${request.course}\nสถานะ: ${request.status}`);
      },
      getStatusClass(status) {
        // กำหนดสีตามสถานะ
        if (status === 'อนุมัติ') return 'status-approved';
        if (status === 'รอพิจารณา') return 'status-pending';
        return 'status-rejected';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Animations */
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
  
  @keyframes scaleUp {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.05);
    }
  }
  
  .profile-page {
    min-height: 100vh;
    background: #FFFFFF; /* Background: ขาว */
    font-family: 'Kanit', sans-serif;
    padding: 20px;
    color: #111827; /* Text: ดำ */
  }
  
  /* Header */
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: #FFFFFF; /* Background: ขาว */
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.8s ease-out;
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
    animation: scaleUp 0.5s ease-in-out infinite alternate;
  }
  
  .header-text h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #2563EB; /* Primary: น้ำเงิน */
  }
  
  .header-text p {
    margin: 5px 0 0;
    font-size: 1rem;
    color: #6B7280; /* Secondary: เทา */
  }
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #F9FAFB;
    border: 1px solid #6B7280; /* Secondary: เทา */
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    color: #111827; /* Text: ดำ */
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  
  .back-btn:hover {
    background: #E5E7EB;
    transform: translateY(-2px);
  }
  
  /* Profile Container */
  .profile-container {
    background: #FFFFFF; /* Background: ขาว */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    animation: fadeIn 1s ease-out;
  }
  
  /* User Info Section */
  .profile-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #F9FAFB;
    border-radius: 8px;
    border-left: 5px solid #2563EB; /* Primary: น้ำเงิน */
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .profile-section:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .profile-section h2 {
    font-size: 1.5rem;
    color: #2563EB; /* Primary: น้ำเงิน */
    margin-bottom: 15px;
    border-bottom: 2px solid #2563EB; /* Primary: น้ำเงิน */
    padding-bottom: 5px;
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
    color: #111827; /* Text: ดำ */
    margin-bottom: 5px;
  }
  
  .info-item p {
    font-size: 1rem;
    color: #6B7280; /* Secondary: เทา */
  }
  
  .edit-btn {
    margin-top: 20px;
    padding: 10px 20px;
    background: #F97316; /* Accent: ส้ม */
    color: #FFFFFF; /* ขาว */
    border: none;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  
  .edit-btn:hover {
    background: #EA580C; /* ส้มเข้ม */
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  }
  
  /* Request History Section */
  .history-table {
    width: 100%;
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th, td {
    border: 1px solid #ddd; /* Secondary: เทา */
    padding: 12px;
    text-align: center;
  }
  
  th {
    background: #2563EB; /* Primary: น้ำเงิน */
    color: #FFFFFF; /* ขาว */
    font-weight: 500;
  }
  
  td {
    color: #111827; /* Text: ดำ */
  }
  
  .status-approved {
    color: #10B981; /* เขียว */
    font-weight: 500;
  }
  
  .status-pending {
    color: #F97316; /* Accent: ส้ม */
    font-weight: 500;
  }
  
  .status-rejected {
    color: #EF4444; /* แดง */
    font-weight: 500;
  }
  
  .view-btn {
    padding: 8px 15px;
    background: #2563EB; /* Primary: น้ำเงิน */
    color: #FFFFFF; /* ขาว */
    border: none;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  
  .view-btn:hover {
    background: #1E40AF; /* น้ำเงินเข้ม */
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      gap: 15px;
    }
  
    .back-btn {
      width: 100%;
      justify-content: center;
    }
  
    .info-grid {
      grid-template-columns: 1fr;
    }
  
    th, td {
      padding: 8px;
      font-size: 0.9rem;
    }
  
    .view-btn {
      padding: 6px 10px;
      font-size: 0.8rem;
    }
  }
  </style>